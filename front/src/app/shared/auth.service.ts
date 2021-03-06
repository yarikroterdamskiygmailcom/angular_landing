import {Injectable} from '@angular/core';
import {User} from './models/user.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = '';

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<{ User }> {
    return this.http.post<{ User }>('/matches/auth/register', user)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(user: User): Observable<{ token: string, id: string }> {
    return this.http.post<{ token: string, id: string }>('/matches/auth/login', user)
      .pipe(
        tap(
          ({token, id}) => {
            localStorage.setItem('auth-token', token);
            this.setTocken(token);
          }
        ),
        catchError(this.handleError)
      );
  }

  postConfirm(data): Observable<{ any }> {
    return this.http.post<{ any }>('/matches/auth/confirmation', {token: data.token, email: data.email})
      .pipe(
        catchError(this.handleError)
      );
  }

  postResend(data): Observable<{ any }> {
    return this.http.post<{ any }>('/matches/auth/resend', {email: data.email})
      .pipe(
        catchError(this.handleError)
      );
  }

  meilSend(data): Observable<{ any }> {
    return this.http.post<{ any }>('/matches/auth/update', {email: data.email})
      .pipe(
        catchError(this.handleError)
      );
  }

  changepass(data): Observable<{ any }> {
    return this.http.post<{ any }>('/matches/auth/changepass', {
      email: data.email,
      token: data.token,
      password: data.password
    })
      .pipe(
        catchError(this.handleError)
      );
  }


  setTocken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logOut() {
    this.setTocken('');
    localStorage.clear();
  }

  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
