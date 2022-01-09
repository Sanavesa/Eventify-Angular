import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { EventFull } from '../interfaces/event-full';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private dataSource = new ReplaySubject<EventFull>();
  onData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  update(id: string): void {
    const baseUrl: string = 'http://localhost:8080/info';

    const httpParams: HttpParams = new HttpParams()
      .set('id', id);

    this.http
      .get<any>(baseUrl, { params: httpParams, responseType: 'json' })
      .subscribe(data => {
        try {
          console.log('Details', data);
          this.dataSource.next(data);
        } catch (error) {
          console.log('Details Error', error);
        }
      }, error => {
        console.log('Details Error', error);
      });
  }
}