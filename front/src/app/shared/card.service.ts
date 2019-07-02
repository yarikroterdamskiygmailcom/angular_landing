import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  cartItem = 0;
  message = '';
  messageType = '';

  constructor(private http: HttpClient,
    private router: Router) {
    console.log(this.router.events)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
  }

  createCard(card): Observable<{ any }> {
    console.log('OOOOO', card)
    return this.http.post<{ any }>('/matches/stripe/payment', { card })
      .pipe(
        catchError(this.handleError)
      );
  }
  payViaPaypal(card): Observable<{ any }> {
    console.log('OOOOO', card)
    return this.http.post<{ any }>('/matches/paypal/payment', { card })
      .pipe(
        catchError(this.handleError)
      );
  }

  paypalConfirm(userId, price, tariff, paymentId, payerID): Observable<{ any }> {

    return this.http.get<{ any }>(`/matches/paypal/result/${userId}/${price}/${tariff}/${paymentId}/${payerID}`)
      .pipe(
        catchError(this.handleError)
      );
  }


  error(message) {
    this.messageType = 'danger';
    this.message = message;
  }

  success(message) {
    this.messageType = 'success';
    this.message = message;
  }

  warning(message) {
    this.messageType = 'warning';
    this.message = message;
  }
  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
