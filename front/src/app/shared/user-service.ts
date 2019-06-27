import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profile } from './models/profile.model';
import { User } from './models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/matches/user/get/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
