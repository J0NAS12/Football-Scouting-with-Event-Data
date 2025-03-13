import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { not } from 'rxjs/internal/util/not';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  public getCompetititons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/competitions`);
  }

  public getMatchesList(competition_id = undefined): Observable<any> {
    let params = new HttpParams();
    if (competition_id !== undefined) {
      params = params.set('competition_id', competition_id);
    }
    return this.http.get(`${this.apiUrl}/matches`, { params });
  }

  public getEventsList(match_id = undefined): Observable<any> {
    let params = new HttpParams();
    if (match_id !== undefined) {
      params = params.set('match_id', match_id);
    }
    return this.http.get(`${this.apiUrl}/match/events`, { params });
  }

  public getEventwithPlayerPositions(event_id = undefined): Observable<any> {
    let params = new HttpParams();
    if (event_id !== undefined) {
      params = params.set('event_id', event_id);
    }
    return this.http.get(`${this.apiUrl}/event`, { params });
  }

  public getTeams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teams`);
  }
}
