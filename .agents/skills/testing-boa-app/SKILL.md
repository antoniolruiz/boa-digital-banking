# Testing boa-digital-banking App

## Prerequisites

- Node 16 via nvm (see angular-migration SKILL for setup)
- Chrome binary at `/opt/.devin/chrome/chrome/linux-133.0.6943.126/chrome-linux64/chrome`

## Serving the App Locally

The library must be built before serving:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 16.20.2
cd /home/ubuntu/repos/boa-digital-banking
npx ng build boa-ui
npx ng serve --port 4200
```

The app auto-compiles and serves at `http://localhost:4200`. No login credentials needed — the app auto-authenticates via `SsoAuthService.login()` in `app.component.ts`.

## App Navigation

All routes are lazy-loaded and guarded by `AuthGuard` (auto-login handles auth). The default route redirects to `/dashboard`.

| Route | Feature | Key Material Components |
|-------|---------|------------------------|
| `/dashboard` | Account overview, spending chart, quick actions | `mat-card`, `mat-icon`, `mat-button`, `mat-badge` |
| `/accounts` | Account list with summary cards | `meridian-account-summary`, `mat-icon`, `mat-button` |
| `/accounts/:id/transactions` | Transaction history table | `mat-table`, `mat-paginator`, `mat-sort`, `mat-form-field`, `mat-input` |
| `/transfers` | Transfer form with reactive validation | `mat-form-field`, `mat-select`, `mat-input`, `mat-datepicker`, `mat-error`, `mat-hint` |
| `/bill-pay` | Payee management | `mat-table`, `mat-form-field` |
| `/alerts` | Alert feed | `mat-list`, `mat-icon` |
| `/profile` | Profile settings | `mat-form-field`, `mat-input`, `mat-select` |

## Key Pages for Migration Testing

When verifying Angular version migrations, focus on these pages in order of priority:

1. **Dashboard** (`/dashboard`) — Exercises the `meridian-nav-shell` (toolbar, sidenav, menu, icons) which wraps every page. If the nav shell breaks, nothing works.
2. **Transfers** (`/transfers`) — Most diverse Material form components: `mat-form-field` with outline appearance, `mat-select` dropdowns, `mat-datepicker`, `mat-input`, `mat-error` validation, `mat-hint`. Good for catching form field migration issues.
3. **Transaction History** (`/accounts/acct-001/transactions`) — Exercises `mat-table` with `MatTableDataSource`, `mat-paginator`, `mat-sort`, and search `mat-form-field`. Navigate via Accounts → click "Transactions" on first account.

## Console Errors to Watch For

After visiting each page, check the browser console for:

- **`NG0300: Multiple components match node`** — Indicates mixed MDC/Legacy Material modules. This happens when the library (`boa-ui`) uses different Material module paths than the main app. Ensure both use the same prefix strategy.
- **`NullInjectorError: No provider for`** — Missing module import after migration.
- **`Can't bind to 'X' since it isn't a known property`** — Template binding broken by renamed/removed directive.
- **`[Erica Analytics] Flushing N events`** — This is expected analytics logging, not an error.

## Unit Tests

```bash
CHROME_BIN=/opt/.devin/chrome/chrome/linux-133.0.6943.126/chrome-linux64/chrome \
  npx ng test --no-watch --browsers=ChromeHeadlessNoSandbox
```

Baseline: 94 specs, all passing. The library's karma.conf.js may be missing the `ChromeHeadlessNoSandbox` custom launcher — this is a pre-existing issue.

## Build Verification

```bash
# Full build chain (order matters)
npx ng build boa-ui && npx ng build boa-digital-banking
cd downstream-consumer && npx ng build && cd ..
```

## Devin Secrets Needed

No secrets are required for local testing — the app uses mock data and auto-authentication.

For the migration dashboard (separate feature):
- `SERVICE_ANTONIO` — Devin API token for triggering migration sessions
- `GITHUB_TOKEN` — GitHub PAT for repo scanning
