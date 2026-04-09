# BoA Digital Banking — Angular 14 Enterprise Demo

> **Disclaimer:** This repository is a synthetic demo environment inspired by publicly known aspects of Bank of America's technology stack. It is **not** affiliated with, endorsed by, or sourced from Bank of America. All service names, API endpoints, and business logic are fictional.

## Purpose

This repository demonstrates a realistic Angular 14 enterprise banking application. It is designed to showcase how [Devin](https://devin.ai) (an AI software engineer by Cognition) performs an **Angular 14 → Angular 18 migration** on a complex, enterprise-grade codebase.

## Architecture Overview

```
boa-digital-banking/
├── projects/boa-ui/           # Shared component library (@boa-ui/meridian-design-system)
│   └── src/lib/
│       ├── meridian-button/        # Custom button wrapping mat-button
│       ├── meridian-card/          # Card component with BoA theming
│       ├── meridian-data-table/    # Table with sorting, pagination, export
│       ├── meridian-form-field/    # Custom form controls (ControlValueAccessor)
│       ├── meridian-alert-banner/  # Alert/notification banner
│       ├── meridian-modal/         # Dialog service using ComponentFactoryResolver
│       ├── meridian-nav-shell/     # App shell with header, sidebar, footer
│       ├── meridian-account-summary/ # Account card with balance display
│       └── meridian-secure-badge/  # PII masking toggle component
│
├── src/app/
│   ├── core/                  # Singleton services, interceptors, guards
│   │   ├── auth/              # SSO/MFA auth service, AuthGuard, AuthInterceptor
│   │   ├── analytics/         # Erica Analytics SDK wrapper
│   │   └── error-handling/    # Global error handler
│   ├── features/
│   │   ├── dashboard/         # Heavy RxJS (combineLatest, switchMap chains)
│   │   ├── accounts/          # Account list, detail, transaction history
│   │   ├── transfers/         # Reactive forms with complex validation
│   │   ├── bill-pay/          # Payee management, payment history
│   │   ├── alerts/            # Alert feed with WebSocket simulation
│   │   └── profile/           # Profile settings, security, notifications
│   └── shared/                # SharedModule with pipes, directives, models
│
├── downstream-consumer/       # Separate app consuming the shared library
├── e2e/                       # Protractor e2e tests (deprecated in Angular 15+)
└── ASSUMPTIONS.md             # Assumptions made for this demo
```

## Key Migration Pain Points (Angular 14 → 18)

This codebase intentionally includes 10 critical patterns that represent real breaking changes:

| # | Pattern | Location | Migration Target |
|---|---------|----------|-----------------|
| 1 | NgModule-heavy architecture | Every `*.module.ts` | Standalone components |
| 2 | Class-based HttpInterceptors | `auth.interceptor.ts`, `analytics.interceptor.ts` | Functional interceptors via `withInterceptors()` |
| 3 | Class-based CanActivate guards | `auth.guard.ts` | Functional guards |
| 4 | ComponentFactoryResolver | `meridian-modal.service.ts` | `ViewContainerRef.createComponent()` |
| 5 | Heavy RxJS (manual subscribe) | `dashboard.component.ts` | Signals / `toSignal()` |
| 6 | Angular Material 14 APIs | `shared.module.ts`, all components | MDC-based Material components |
| 7 | loadChildren with modules | `app-routing.module.ts` | `loadComponent` with standalone |
| 8 | Protractor e2e tests | `e2e/` | Cypress or Playwright |
| 9 | ViewEngine artifacts | `entryComponents` arrays | Remove (no-op with Ivy) |
| 10 | HttpClientModule import | `app.module.ts`, `core.module.ts` | `provideHttpClient()` |

## Tech Stack

- **Angular**: 14.2.x
- **Angular Material**: 14.2.x
- **TypeScript**: 4.7.x
- **RxJS**: 7.5.x
- **Node**: 16.x
- **Testing**: Karma + Jasmine (unit), Protractor (e2e)
- **Linting**: ESLint with @angular-eslint

## Getting Started

```bash
# Install dependencies
npm install

# Build the shared library first
ng build boa-ui

# Build the main application
ng build boa-digital-banking

# Run unit tests
ng test

# Run linting
ng lint

# Serve the application
ng serve
```

## Downstream Consumer

The `downstream-consumer/` directory simulates a downstream team's application:

```bash
cd downstream-consumer
npm install
ng build
```

This app imports `BoaUiModule` from `@boa-ui/meridian-design-system` and uses 4 library components. Its build must continue to pass after the library is upgraded.

## Naming Convention

| Name | Description |
|------|-------------|
| `@boa-ui/` | Organization scope |
| `boa-digital-banking` | Main application |
| `@boa-ui/meridian-design-system` | Shared component library |
| `boa-auth-sso` | Auth service (mock OIDC) |
| `erica-analytics-sdk` | Analytics SDK (named after BoA's virtual assistant) |

## Build Verification

All of these must pass:

- ✓ `ng build boa-ui` — Library builds independently
- ✓ `ng build boa-digital-banking` — Main app builds
- ✓ `ng test` — Unit tests pass
- ✓ `ng lint` — Linting passes
- ✓ `downstream-consumer: ng build` — Consumer app builds
- ✓ `ng e2e` — Protractor tests execute

## License

This project is for demonstration purposes only.
