export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  accountId?: string;
  transactionId?: string;
  createdAt: string;
  readAt?: string;
  isRead: boolean;
  isDismissed: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string>;
}

export enum AlertType {
  BALANCE_LOW = 'BALANCE_LOW',
  BALANCE_HIGH = 'BALANCE_HIGH',
  LARGE_TRANSACTION = 'LARGE_TRANSACTION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  PAYMENT_DUE = 'PAYMENT_DUE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  TRANSFER_COMPLETE = 'TRANSFER_COMPLETE',
  DEPOSIT_RECEIVED = 'DEPOSIT_RECEIVED',
  STATEMENT_READY = 'STATEMENT_READY',
  SECURITY_ALERT = 'SECURITY_ALERT',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  PROMOTIONAL = 'PROMOTIONAL'
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface AlertPreference {
  alertType: AlertType;
  enabled: boolean;
  channels: AlertChannel[];
  threshold?: number;
  accountIds?: string[];
}

export enum AlertChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH'
}

export interface AlertFeedResponse {
  alerts: Alert[];
  totalCount: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}
