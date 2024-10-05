import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private url : string = 'https://itunes.apple.com/us/rss/topalbums/limit=100/json';
  
  constructor(private http: HttpClient) {}

  getAlbums(): Observable<any> {
    return this.http.get(this.url);
  }
}
