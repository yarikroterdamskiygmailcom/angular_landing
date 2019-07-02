import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profile } from './models/profile.model';
import {SignUpService} from './sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {

  profileId = new Subject<string>();

  constructor(private http: HttpClient,
              private signUpService: SignUpService) { }

  getProfile(id: string): Observable<Profile> {
    this.signUpService.setEvent({userId: id});
    return this.http.get<Profile>(`/matches/profile/get/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProfile(id: string, profile: any): Observable<any> {


    return this.http.patch<any>(`/matches/profile/update/${id}`, profile)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
