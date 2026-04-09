import { Pipe, PipeTransform } from '@angular/core';

/**
 * Displays dates in relative format (e.g., "2 hours ago", "Yesterday", "Jan 15")
 * Falls back to absolute date for anything older than 7 days.
 *
 * Usage: {{ dateString | dateRelative }}
 */
@Pipe({
  name: 'dateRelative'
})
export class DateRelativePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: 'short' | 'long' = 'short'): string {
    if (!value) {
      return '—';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return '—';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'Just now';
    }

    if (diffMinutes < 60) {
      return format === 'long'
        ? `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
        : `${diffMinutes}m ago`;
    }

    if (diffHours < 24) {
      return format === 'long'
        ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        : `${diffHours}h ago`;
    }

    if (diffDays === 1) {
      return 'Yesterday';
    }

    if (diffDays < 7) {
      return format === 'long'
        ? `${diffDays} days ago`
        : `${diffDays}d ago`;
    }

    // For dates older than 7 days, show the formatted date
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (date.getFullYear() === now.getFullYear()) {
      return `${months[date.getMonth()]} ${date.getDate()}`;
    }

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
