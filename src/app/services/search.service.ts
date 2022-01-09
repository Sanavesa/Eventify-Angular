import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { EventBrief } from '../interfaces/event-brief';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private dataSource = new ReplaySubject<Array<EventBrief>>();
  onData = this.dataSource.asObservable();

  private requestSource = new Subject<any>();
  onRequest = this.requestSource.asObservable();

  private errorSource = new Subject<any>();
  onError = this.errorSource.asObservable();

  private resetSource = new Subject<any>();
  onReset = this.resetSource.asObservable();

  isReset: boolean = false;

  constructor(private http: HttpClient) { }

  reset(): void {
    this.dataSource.next([]);
    this.resetSource.next(null);
    this.isReset = true;
  }

  update(keyword: string, category: string, distance: string, units: string, latitude: string, longitude: string): void {
    this.isReset = false;

    const baseUrl: string = 'http://localhost:8080/search';

    const httpParams: HttpParams = new HttpParams()
      .set('keyword', keyword)
      .set('category', category)
      .set('distance', distance)
      .set('distance_units', units)
      .set('latitude', latitude)
      .set('longitude', longitude);

    this.requestSource.next(null);
    
    this.http
      .get<any>(baseUrl, { params: httpParams, responseType: 'json' })
      .subscribe(data => {
        try {
          console.log('Search', data);
          let entries: Array<EventBrief> = [];
          for (let event of data.events) {
            let entry: EventBrief = {
              date: event.date,
              name: event.name,
              category: event.category,
              venue: event.venue,
              id: event.id
            };
            entries.push(entry);
          }

          console.log('Search Entries', entries);
          this.dataSource.next(entries);
        } catch (error) {
          console.log('Search Error', error);
          this.errorSource.next(null);
        }
      }, error => {
        console.log('Search Error', error);
        this.errorSource.next(null);
      });
  }
}