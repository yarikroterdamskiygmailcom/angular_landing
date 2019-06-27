import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {
  transform(value: any) {
    const userTimeZone = localStorage.getItem('timezone');
    const matchTime = moment.tz(value * 1000, userTimeZone);
    return matchTime;
  }
}
