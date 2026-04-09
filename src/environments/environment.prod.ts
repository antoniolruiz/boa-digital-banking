export const environment = {
  production: true,
  apiBaseUrl: 'https://api.boa-digital.internal/v2',
  authConfig: {
    issuer: 'https://sso.boa-digital.internal/auth/realms/digital-banking',
    clientId: 'boa-digital-banking-spa',
    redirectUri: 'https://digital.bankofamerica-demo.com/auth/callback',
    scope: 'openid profile email accounts transactions',
    responseType: 'code',
    silentRefreshRedirectUri: 'https://digital.bankofamerica-demo.com/silent-refresh.html',
    sessionCheckInterval: 15000
  },
  analyticsConfig: {
    ericaEndpoint: 'https://erica-analytics.boa-digital.internal/v1/events',
    samplingRate: 0.1,
    enableDebug: false
  },
  featureFlags: {
    enableZelle: true,
    enableMerrillIntegration: true,
    enableBiometricAuth: true,
    enablePushNotifications: true
  },
  sessionTimeoutMinutes: 10,
  maxTransferAmount: 50000,
  piiMaskingEnabled: true
};
