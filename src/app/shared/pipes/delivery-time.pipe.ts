import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'deliveryTime', standalone: true })
export class DeliveryTimePipe implements PipeTransform {
  transform(min: number | null | undefined, max?: number): string {
    if (min === null || min === undefined) return '';
    if (max) {
      return `${min}–${max} min`;
    }
    return `${min} min`;
  }
}
