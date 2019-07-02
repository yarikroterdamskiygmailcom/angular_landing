import { Injectable } from '@angular/core';
import { Tariff } from './models/tariff.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  constructor(private http: HttpClient) { }

  getTariff(id: string): Observable<Tariff> {
    return this.http.get<Tariff>(`/matches/tariff/get/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAll(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>('/matches/tariff/getall')
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(res: HttpErrorResponse) {
    return observableThrowError(res.error || 'Server error');
  }
}
