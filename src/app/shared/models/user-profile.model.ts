export interface UserProfile {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string; // Last 4 digits only in UI
  address: Address;
  preferences: UserPreferences;
  securitySettings: SecuritySettings;
  enrollmentDate: string;
  lastLoginDate: string;
  memberSince: string;
  segment: CustomerSegment;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currencyDisplay: string;
  defaultAccountId: string;
  dashboardLayout: string;
  enablePaperless: boolean;
  marketingOptIn: boolean;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethod: MfaMethod;
  lastPasswordChange: string;
  trustedDevices: TrustedDevice[];
  loginNotifications: boolean;
  transactionAlerts: boolean;
}

export enum MfaMethod {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  AUTHENTICATOR = 'AUTHENTICATOR',
  SECURITY_KEY = 'SECURITY_KEY'
}

export interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: string;
  lastUsed: string;
  browser: string;
  os: string;
}

export enum CustomerSegment {
  STANDARD = 'STANDARD',
  PREFERRED_REWARDS_GOLD = 'PREFERRED_REWARDS_GOLD',
  PREFERRED_REWARDS_PLATINUM = 'PREFERRED_REWARDS_PLATINUM',
  PREFERRED_REWARDS_DIAMOND = 'PREFERRED_REWARDS_DIAMOND',
  PRIVATE_BANK = 'PRIVATE_BANK'
}
