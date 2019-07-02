import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ucFirst',
})
export class ucFirst implements PipeTransform {
  transform(value: any) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
