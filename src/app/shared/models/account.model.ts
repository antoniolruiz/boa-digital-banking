export interface Account {
  id: string;
  accountNumber: string;
  routingNumber: string;
  accountType: AccountType;
  accountName: string;
  nickname?: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: AccountStatus;
  lastActivityDate: string;
  openedDate: string;
  interestRate?: number;
  creditLimit?: number;
  minimumPayment?: number;
  paymentDueDate?: string;
  isPrimary: boolean;
}

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  MONEY_MARKET = 'MONEY_MARKET',
  CD = 'CD',
  IRA = 'IRA',
  BROKERAGE = 'BROKERAGE'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  FROZEN = 'FROZEN',
  PENDING = 'PENDING'
}

export interface AccountSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  accounts: Account[];
  lastUpdated: string;
}
