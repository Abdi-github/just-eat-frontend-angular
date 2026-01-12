import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyChf', standalone: true })
export class CurrencyChfPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'CHF 0.00';
    return `CHF ${value.toFixed(2)}`;
  }
}
