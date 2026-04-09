import { UserProfile, CustomerSegment, MfaMethod } from '../../app/shared/models/user-profile.model';

export const MOCK_USER: UserProfile = {
  id: 'usr-001',
  customerId: 'CUST-78459201',
  firstName: 'Alexandra',
  lastName: 'Richardson',
  middleName: 'M',
  email: 'a.richardson@example.com',
  phone: '(704) 555-0142',
  dateOfBirth: '1985-07-22',
  ssn: '****6789',
  address: {
    line1: '4200 Gateway Blvd',
    line2: 'Suite 210',
    city: 'Charlotte',
    state: 'NC',
    zipCode: '28217',
    country: 'US'
  },
  preferences: {
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currencyDisplay: 'USD',
    defaultAccountId: 'acct-001',
    dashboardLayout: 'standard',
    enablePaperless: true,
    marketingOptIn: false
  },
  securitySettings: {
    mfaEnabled: true,
    mfaMethod: MfaMethod.AUTHENTICATOR,
    lastPasswordChange: '2023-11-15T00:00:00Z',
    trustedDevices: [
      {
        id: 'dev-001',
        deviceName: 'MacBook Pro',
        deviceType: 'DESKTOP',
        lastUsed: '2024-01-15T10:00:00Z',
        browser: 'Chrome 120',
        os: 'macOS 14.2'
      },
      {
        id: 'dev-002',
        deviceName: 'iPhone 15 Pro',
        deviceType: 'MOBILE',
        lastUsed: '2024-01-14T22:00:00Z',
        browser: 'Safari',
        os: 'iOS 17.2'
      }
    ],
    loginNotifications: true,
    transactionAlerts: true
  },
  enrollmentDate: '2018-03-22T00:00:00Z',
  lastLoginDate: '2024-01-15T09:45:00Z',
  memberSince: '2018-03-22T00:00:00Z',
  segment: CustomerSegment.PREFERRED_REWARDS_PLATINUM
};
