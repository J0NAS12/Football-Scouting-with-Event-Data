import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  public getPlayerList(cluster = null): Observable<any> {
    let params = new HttpParams();

    if (cluster) {
      params = params.set('cluster', cluster);
    }
    return this.http.get(`${this.apiUrl}/players`, { params });
  }

  public getPlayer(id: any): Observable<any> {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get(`${this.apiUrl}/player`, { params });
  }

  public getPlayerStats(match_id = undefined): Observable<any> {
    let params = new HttpParams();
    if (match_id !== undefined) {
      params = params.set('match_id', match_id);
    }
    return this.http.get(`${this.apiUrl}/match/playerstats`, { params });
  }

  public getPlayerEvents(id: any, events: any[]): Observable<any> {
    let params = new HttpParams();
    params = params.set('player_id', id);
    console.log(events);
    events.forEach((event) => {
      params = params.append('type_id', event.id);
    });
    return this.http.get(`${this.apiUrl}/player/events`, { params });
  }
  public getEventTypes() {
    return this.http.get(`${this.apiUrl}/eventtypes`);
  }

  getAttributeBucket(id: any, attribute: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/player/${id}/stat-buckets/${attribute}`
    );
  }
}
