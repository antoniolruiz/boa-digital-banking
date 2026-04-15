import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats currency values with proper BoA display conventions.
 * Handles negative values (debits) with parentheses notation used in banking.
 *
 * Usage: {{ amount | boaCurrency:'USD':'symbol' }}
 */
@Pipe({
  name: 'boaCurrency',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currencyCode = 'USD',
    display: 'symbol' | 'code' | 'name' = 'symbol',
    locale = 'en-US'
  ): string {
    if (value === null || value === undefined) {
      return '—';
    }

    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);

    let symbol = '$';
    if (display === 'code') {
      symbol = currencyCode + ' ';
    } else if (display === 'name') {
      symbol = '';
    }

    const formatted = absoluteValue.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (display === 'name') {
      const currencyName = this.getCurrencyName(currencyCode);
      return isNegative
        ? `(${formatted} ${currencyName})`
        : `${formatted} ${currencyName}`;
    }

    return isNegative
      ? `(${symbol}${formatted})`
      : `${symbol}${formatted}`;
  }

  private getCurrencyName(code: string): string {
    const names: Record<string, string> = {
      'USD': 'US Dollars',
      'EUR': 'Euros',
      'GBP': 'British Pounds',
      'CAD': 'Canadian Dollars'
    };
    return names[code] || code;
  }
}
