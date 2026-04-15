# Migration Dashboard — SKILL.md

## Overview

The Migration Dashboard (`migration-dashboard/index.html`) is a self-contained HTML file (no build step) that orchestrates the step-by-step Angular 14 → 18 migration of this repo using the Devin API. It scans the GitHub repo, displays 4 sequential upgrade phases with 27 total tasks, and triggers Devin sessions for each task.

## Secrets & Configuration

The dashboard requires two API tokens configured in `migration-dashboard/config.js` (git-ignored):

| Secret              | Environment Variable | Purpose                                      |
|---------------------|---------------------|----------------------------------------------|
| Devin API token     | `$SERVICE_ANTONIO`  | Bearer token for creating/polling Devin sessions |
| GitHub PAT          | `$GITHUB_TOKEN`     | GitHub API access for repo scanning           |

### Setup config.js

```bash
cd migration-dashboard
cp config.example.js config.js
# Edit config.js — set DEVIN_API_TOKEN and GITHUB_TOKEN
```

When running inside a Devin session, the secrets are available as environment variables:
- `$SERVICE_ANTONIO` → use as `DEVIN_API_TOKEN`
- `$GITHUB_TOKEN` → use as `GITHUB_TOKEN`

### Programmatic config.js creation (for Devin sessions)

```bash
cat > migration-dashboard/config.js << 'JSEOF'
window.MIGRATION_CONFIG = {
  DEVIN_API_TOKEN: '$SERVICE_ANTONIO',
  GITHUB_TOKEN: '$GITHUB_TOKEN',
  DEVIN_API_BASE: 'https://api.devin.ai/v1'
};
JSEOF
```

> **Note:** `$SERVICE_ANTONIO` and `$GITHUB_TOKEN` above are literal secret references. When creating the file programmatically in a Devin session, use the actual environment variable expansion (e.g., `"${SERVICE_ANTONIO}"` in a shell heredoc without single quotes).

## Running the Dashboard

```bash
# Option 1: Open directly in browser
google-chrome migration-dashboard/index.html

# Option 2: Serve with a simple HTTP server (recommended for CORS)
cd migration-dashboard && python3 -m http.server 8080
# Then open http://localhost:8080
```

## Dashboard Architecture

```
migration-dashboard/
├── index.html          # Self-contained dashboard (HTML + CSS + JS, ~2100 lines)
├── config.js           # API tokens (git-ignored, created from config.example.js)
└── config.example.js   # Template with instructions for token setup
```

### Key Features

1. **Repository Scanning**: Uses GitHub API to validate repo exists, detect Angular version from `package.json`, find `angular.json` workspace config, `boa-ui` library, and `downstream-consumer`.

2. **4 Sequential Phases** (locked until previous completes):
   - Phase 1: Angular 14 → 15 (6 tasks) — Standalone APIs, MDC Material, remove entryComponents
   - Phase 2: Angular 15 → 16 (6 tasks) — Signals intro, DestroyRef, provideRouter/provideHttpClient
   - Phase 3: Angular 16 → 17 (7 tasks) — @if/@for control flow, esbuild/Vite, standalone default
   - Phase 4: Angular 17 → 18 (8 tasks) — Zoneless CD, @let syntax, final cleanup

3. **Devin API Integration**: Each task triggers a Devin session via `POST /v1/sessions` with a detailed prompt. Status polled every 10s via `GET /v1/session/:id`.

4. **State Persistence**: Dashboard state (task statuses, session IDs, session URLs) is saved to `localStorage` and auto-restored on page refresh. A "Reset All" button clears saved state for fresh demos.

5. **Overall Progress Bar**: Visual phase-by-phase progress bar showing percentage completion per phase.

### JavaScript Functions (key entry points)

| Function                     | Purpose                                                |
|------------------------------|--------------------------------------------------------|
| `scanRepository()`          | Validates repo via GitHub API, builds migration phases |
| `triggerDevin(phaseIdx, taskIdx)` | Creates a Devin session for a specific task       |
| `startPolling(pi, ti, id)`  | Polls Devin API for session status every 10s           |
| `upgradeAllPendingInPhase(i)` | Triggers all pending tasks in a phase sequentially   |
| `refreshPhaseStatuses(i)`   | Re-fetches statuses for in-progress tasks              |
| `saveState()` / `restoreState()` | localStorage persistence                          |
| `resetDashboard()`          | Clears all state for a fresh demo                      |
| `buildMigrationPhases()`    | Returns the 4-phase task definition array              |

## Testing the Dashboard

1. Create `config.js` with valid tokens (see above)
2. Open `migration-dashboard/index.html` in Chrome
3. Click "Scan Repository" — should show green "Repository found" in the log
4. Verify Phase 1 is "Ready" and Phases 2-4 are "Locked"
5. Click "Upgrade" on any Phase 1 task to trigger a Devin session
6. Verify the session link appears and status updates via polling
7. Refresh the page — state should be restored from localStorage

## Demo Flow

For a live demo of the Angular 14 → 18 migration:

1. Open the dashboard, scan the repo
2. Walk through Phase 1 tasks, explaining each migration step
3. Click "Upgrade All Pending" to trigger all Phase 1 tasks via Devin
4. As tasks complete, Phase 2 unlocks automatically
5. Continue phase by phase — the progress bar shows overall completion
6. Use "Reset All" to start fresh if needed
