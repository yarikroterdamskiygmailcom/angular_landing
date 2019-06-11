import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profile } from './models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {

  profileId = new Subject<string>();

  constructor(private http: HttpClient) { }

  getProfile(id: string): Observable<Profile> {
    return this.http.get<Profile>(`http://localhost:4000/matches/profile/get/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProfile(id: string, profile: any): Observable<any> {


    return this.http.patch<any>(`http://localhost:4000/matches/profile/update/${id}`, profile)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
