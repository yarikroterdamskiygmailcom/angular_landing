import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  private EventVoid = new Subject<any>();

  getEvent(): Observable<any> {
    return this.EventVoid.asObservable();
  }

  setEvent(value: any) {
    this.EventVoid.next(value);
  }
}
