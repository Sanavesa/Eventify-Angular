import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeoCoord } from '../interfaces/geo-coord';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private dataSource = new BehaviorSubject<GeoCoord>({
    latitude: '',
    longitude: '',
    localLatitude: '',
    localLongitude: ''
  });

  onData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  updateFromCurrent(): void {
    let prevEntry: GeoCoord = this.dataSource.value;
    if (prevEntry && (prevEntry.localLatitude != '' || prevEntry.localLongitude != '')) {
      console.log('Cached Current Location Entry', prevEntry);
      this.dataSource.next(prevEntry);
      return;
    }

    const baseUrl: string = 'https://ipinfo.io/';
    const ipInfoAPIKey: string = 'dc6edb76c8e7fc'; // Can be left in, thats fine

    const httpParams: HttpParams = new HttpParams().set('token', ipInfoAPIKey);

    this.http
      .get<any>(baseUrl, { params: httpParams, responseType: 'json' })
      .subscribe(data => {
        try {
          console.log('Current Location', data);
          const split = data.loc.split(',');
          let entry: GeoCoord = {
            latitude: split[0],
            longitude: split[1],
            localLatitude: split[0],
            localLongitude: split[1]
          };

          console.log('Current Location Entry', entry);
          this.dataSource.next(entry);
        } catch (error) {
          console.log('Current Location Error', error);
        }
      }, error => {
        console.log('Current Location Error', error);
      });
  }

  updateFromOther(location: string): void {
    const baseUrl: string = 'https://maps.googleapis.com/maps/api/geocode/json';
    const googleAPIKey = 'ENTER GOOGLE MAPS API HERE';

    const httpParams: HttpParams = new HttpParams()
      .set('key', googleAPIKey)
      .set('address', location);

    this.http
      .get<any>(baseUrl, { params: httpParams, responseType: 'json' })
      .subscribe(data => {

        try {
          console.log('Other Location', data);
          let entry: GeoCoord = {
            latitude: data.results[0].geometry.location.lat,
            longitude: data.results[0].geometry.location.lng,
            localLatitude: '',
            localLongitude: ''
          };

          let prevEntry: GeoCoord = this.dataSource.value;
          if (prevEntry) {
            entry.localLatitude = prevEntry.localLatitude;
            entry.localLongitude = prevEntry.localLongitude;
          }

          console.log('Other Location Entry', entry);
          this.dataSource.next(entry);
        } catch (error) {
          console.log('Other Location Error', error);
        }
      }, error => {
        console.log('Other Location Error', error);
      });
  }
}
