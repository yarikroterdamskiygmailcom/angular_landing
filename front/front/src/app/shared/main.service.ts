import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError as observableThrowError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(

    private http: HttpClient) { }

  getMatches(selectedDate: string): Observable<any> {
    return this.http.get<any>(`https://www.betminator.com/api/v1/next-matches/${selectedDate}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMatch(id: string): Observable<any> {
    return this.http.get<any>(`https://www.betminator.com/api/v1/match/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
