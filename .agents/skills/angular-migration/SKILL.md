# Angular 14 → 18 Migration — SKILL.md

## Repository Overview

Synthetic Angular 14 monorepo simulating a "Bank of America" digital banking platform. Used as a baseline for testing and demonstrating automated migration from Angular 14 to 18 using Devin.

**Tech Stack:** Angular 14.2.x, Angular Material 14, TypeScript 4.7, RxJS 7.5, Node 16, Karma + Jasmine (unit), Protractor (e2e), ESLint with @angular-eslint.

## Project Structure

```
boa-digital-banking/
├── src/app/                        # Main Angular 14 application
│   ├── core/                       # Singleton services (auth, analytics, error handling)
│   │   ├── auth/                   # SSO service, AuthGuard (class-based), AuthInterceptor
│   │   ├── analytics/              # Erica analytics SDK wrapper, interceptor
│   │   └── error-handling/         # Global error handler, error page
│   ├── features/                   # Lazy-loaded feature modules
│   │   ├── dashboard/              # Heavy RxJS (combineLatest, switchMap chains)
│   │   ├── accounts/               # Account list, detail, transaction history
│   │   ├── transfers/              # Reactive forms with complex validation
│   │   ├── bill-pay/               # Payee management, payment history
│   │   ├── alerts/                 # Alert feed with WebSocket simulation
│   │   └── profile/                # Profile settings, security, notifications
│   ├── shared/                     # SharedModule — pipes, directives, models
│   ├── app.module.ts               # Root NgModule
│   └── app-routing.module.ts       # loadChildren with modules (lazy routes)
│
├── projects/boa-ui/                # Shared component library (@boa-ui/meridian-design-system)
│   └── src/lib/
│       ├── meridian-button/        # Custom button wrapping mat-button
│       ├── meridian-card/          # Card with BoA theming
│       ├── meridian-data-table/    # Table with sorting, pagination, export
│       ├── meridian-form-field/    # Custom ControlValueAccessor
│       ├── meridian-alert-banner/  # Notification banner
│       ├── meridian-modal/         # Dialog via ComponentFactoryResolver (migration target)
│       ├── meridian-nav-shell/     # App shell (header, sidebar, footer)
│       ├── meridian-account-summary/ # Account card with balance display
│       ├── meridian-secure-badge/  # PII masking toggle
│       └── services/               # a11y + theme services
│
├── downstream-consumer/            # Separate app consuming boa-ui library
├── migration-dashboard/            # Migration dashboard (see migration-dashboard SKILL)
├── e2e/                            # Protractor e2e tests (deprecated in Angular 15+)
├── angular.json                    # CLI workspace config (2 projects)
├── .eslintrc.json                  # Linting rules (boa prefix enforcement)
└── ASSUMPTIONS.md                  # Demo assumptions documentation
```

## Build & Development

Requires **Node 16** (use nvm):

```bash
# Setup
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 16.20.2
npm install

# Build (library must build first)
npx ng build boa-ui
npx ng build boa-digital-banking

# Downstream consumer
cd downstream-consumer && npm install && npx ng build && cd ..

# Serve
npx ng serve
```

## Lint

```bash
npx ng lint
```

## Test

```bash
# Unit tests (requires Chrome binary)
CHROME_BIN=/opt/.devin/chrome/chrome/linux-133.0.6943.126/chrome-linux64/chrome \
  npx ng test --no-watch --browsers=ChromeHeadlessNoSandbox
```

## 10 Key Migration Pain Points

These are intentionally included in the codebase to represent real breaking changes:

| # | Pattern | Location | Target |
|---|---------|----------|--------|
| 1 | NgModule-heavy architecture (13 modules) | Every `*.module.ts` | Standalone components |
| 2 | Class-based HttpInterceptors | `auth.interceptor.ts`, `analytics.interceptor.ts` | Functional `withInterceptors()` |
| 3 | Class-based CanActivate guards | `auth.guard.ts` | Functional `CanActivateFn` |
| 4 | ComponentFactoryResolver | `meridian-modal.service.ts` | `ViewContainerRef.createComponent()` |
| 5 | Heavy RxJS (manual subscribe) | `dashboard.component.ts` | Signals / `toSignal()` |
| 6 | Angular Material 14 APIs | `shared.module.ts`, all components | MDC-based Material components |
| 7 | loadChildren with modules | `app-routing.module.ts` | `loadComponent` with standalone |
| 8 | Protractor e2e tests | `e2e/` | Cypress or Playwright |
| 9 | ViewEngine artifacts | `entryComponents` arrays | Remove (no-op with Ivy) |
| 10 | HttpClientModule import | `app.module.ts`, `core.module.ts` | `provideHttpClient()` |

## Sequential Migration Path

The migration follows the Angular team's recommended sequential upgrade: **14 → 15 → 16 → 17 → 18**. Each step must complete before the next begins.

### Phase 1: Angular 14 → 15
- Update core/CLI to v15, TypeScript to ~4.8
- Migrate Material to MDC components (mat-legacy- prefix)
- Remove `entryComponents` arrays
- Update Router (initialNavigation, introduce functional guards)
- Begin standalone component adoption
- Build & test verification

### Phase 2: Angular 15 → 16
- Update core/CLI to v16, TypeScript to ~5.0, Node 16+ required
- Remove legacy Material components (mat-legacy-* removed)
- Adopt `DestroyRef` + `takeUntilDestroyed`
- Use `provideRouter()` + `provideHttpClient()`
- Add `required: true` inputs
- Build & test verification

### Phase 3: Angular 16 → 17
- Update core/CLI to v17, TypeScript to ~5.2, Node 18+ required
- New control flow (@if, @for with track, @switch)
- Migrate to esbuild/Vite build system
- Convert all remaining modules to standalone
- Adopt Signals for reactive state
- Build & test verification

### Phase 4: Angular 17 → 18
- Update core/CLI to v18, TypeScript to ~5.4
- Finalize standalone bootstrap (`bootstrapApplication()`)
- Complete functional guards/interceptors
- Evaluate zoneless change detection
- Adopt `@let` template syntax
- Verify downstream consumer
- Final build, lint & test verification

## Naming Conventions

| Name | Description |
|------|-------------|
| `@boa-ui/` | Organization scope for the shared library |
| `boa-digital-banking` | Main application project name |
| `@boa-ui/meridian-design-system` | Shared component library package |
| `boa` prefix | Mandatory namespace for application selectors |
| `meridian` prefix | Namespace for library component selectors |
| `Erica` | Simulated analytics SDK (named after BoA's virtual assistant) |

## Secrets

| Secret | Variable | Usage |
|--------|----------|-------|
| Devin API token | `$SERVICE_ANTONIO` | Used by migration dashboard to trigger Devin sessions |
| GitHub PAT | `$GITHUB_TOKEN` | Used by migration dashboard for repo scanning via GitHub API |
