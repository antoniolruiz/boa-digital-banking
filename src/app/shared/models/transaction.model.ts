export interface Transaction {
  id: string;
  accountId: string;
  transactionDate: string;
  postDate: string;
  description: string;
  merchantName?: string;
  merchantCategory?: string;
  amount: number;
  runningBalance?: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  category: TransactionCategory;
  checkNumber?: string;
  referenceNumber: string;
  memo?: string;
  isRecurring: boolean;
  isPending: boolean;
  location?: TransactionLocation;
}

export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  TRANSFER = 'TRANSFER',
  FEE = 'FEE',
  INTEREST = 'INTEREST',
  ATM = 'ATM',
  CHECK = 'CHECK',
  WIRE = 'WIRE',
  ACH = 'ACH'
}

export enum TransactionStatus {
  POSTED = 'POSTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export enum TransactionCategory {
  GROCERIES = 'GROCERIES',
  DINING = 'DINING',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES = 'UTILITIES',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTHCARE = 'HEALTHCARE',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
  FEES = 'FEES',
  OTHER = 'OTHER'
}

export interface TransactionLocation {
  city: string;
  state: string;
  country: string;
}

export interface TransactionFilter {
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  transactionType?: TransactionType;
  category?: TransactionCategory;
  searchTerm?: string;
  status?: TransactionStatus;
}
