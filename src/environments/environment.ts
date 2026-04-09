// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://api-dev.boa-digital.internal/v2',
  authConfig: {
    issuer: 'https://sso-dev.boa-digital.internal/auth/realms/digital-banking',
    clientId: 'boa-digital-banking-spa',
    redirectUri: 'http://localhost:4200/auth/callback',
    scope: 'openid profile email accounts transactions',
    responseType: 'code',
    silentRefreshRedirectUri: 'http://localhost:4200/silent-refresh.html',
    sessionCheckInterval: 30000
  },
  analyticsConfig: {
    ericaEndpoint: 'https://erica-analytics-dev.boa-digital.internal/v1/events',
    samplingRate: 1.0,
    enableDebug: true
  },
  featureFlags: {
    enableZelle: true,
    enableMerrillIntegration: false,
    enableBiometricAuth: false,
    enablePushNotifications: true
  },
  sessionTimeoutMinutes: 15,
  maxTransferAmount: 10000,
  piiMaskingEnabled: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
