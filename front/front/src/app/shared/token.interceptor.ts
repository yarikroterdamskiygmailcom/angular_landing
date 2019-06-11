import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated) {

      if (req.url.indexOf('https://www.betminator.com/api/v1/') < 0) {
        req = req.clone({
          setHeaders: {
            Authorization: this.authService.getToken()
          }
        });
      }

    }

    return next.handle(req)
      .pipe(
        catchError(
          (error: HttpErrorResponse) => this.handleAuthError(error)
        )
      );
  }
  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      });
    }
    return throwError(error);
  }
}
