import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeywordSuggestion } from '../interfaces/keyword-suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private dataSource = new BehaviorSubject<Array<KeywordSuggestion>>([]);
  currentData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  update(keyword: string): void {
    const baseUrl: string = 'http://localhost:8080/suggestion';
    
    const httpParams: HttpParams = new HttpParams().set('keyword', keyword);

    this.http.get<any>(baseUrl, { params: httpParams, responseType: 'json' })
      .subscribe(data => {
        console.log('Suggestion', data);
        this.dataSource.next(data);
      });
  }
}