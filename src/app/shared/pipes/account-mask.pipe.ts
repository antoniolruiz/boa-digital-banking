import { Pipe, PipeTransform } from '@angular/core';

/**
 * Masks PII data like account numbers, SSN, phone numbers.
 * Used throughout the app with the meridian-secure-badge toggle.
 *
 * Usage: {{ '1234567890' | accountMask:'account' }}
 * Output: '****7890'
 */
@Pipe({
  name: 'accountMask'
})
export class AccountMaskPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    maskType: 'account' | 'ssn' | 'phone' | 'email' = 'account',
    showFull = false
  ): string {
    if (!value) {
      return '—';
    }

    if (showFull) {
      return value;
    }

    switch (maskType) {
      case 'account':
        return this.maskAccountNumber(value);
      case 'ssn':
        return this.maskSSN(value);
      case 'phone':
        return this.maskPhone(value);
      case 'email':
        return this.maskEmail(value);
      default:
        return this.maskGeneric(value);
    }
  }

  private maskAccountNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      return '****' + cleaned;
    }
    return '****' + cleaned.slice(-4);
  }

  private maskSSN(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      return '***-**-' + cleaned;
    }
    return '***-**-' + cleaned.slice(-4);
  }

  private maskPhone(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      return '(***) ***-' + cleaned;
    }
    return '(***) ***-' + cleaned.slice(-4);
  }

  private maskEmail(value: string): string {
    const parts = value.split('@');
    if (parts.length !== 2) {
      return this.maskGeneric(value);
    }
    const username = parts[0];
    const domain = parts[1];
    const maskedUsername = username.charAt(0) + '****' + username.charAt(username.length - 1);
    return maskedUsername + '@' + domain;
  }

  private maskGeneric(value: string): string {
    if (value.length <= 4) {
      return '****';
    }
    return '****' + value.slice(-4);
  }
}
