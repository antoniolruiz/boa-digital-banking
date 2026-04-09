# Assumptions Made in This Demo Environment

This document records the assumptions made when building this synthetic Angular 14 repository. Reference it during the demo when explaining to the audience what Devin would encounter in a real enterprise environment.

---

## Architecture Assumptions

### Auth follows OIDC/OAuth 2.0
We assume BoA's SSO uses standard OpenID Connect flows. In reality, their internal auth may use proprietary protocols. Devin would need access to their auth SDK documentation to handle non-standard patterns.

### Angular Material is the base design system
Based on the pre-read mentioning "Angular Material with a custom design system layered on top." We assume the customization is via SCSS theming and component wrapping, not deep forks of Material source code.

### Monorepo with Angular CLI workspaces
We assume `ng generate library` was used for the shared component library. Some enterprises use Nx instead, which has different migration tooling.

### CoreModule + SharedModule pattern
We use the classic Angular 14 patterns:
- `CoreModule.forRoot()` for singleton services
- `SharedModule` re-exports common pipes, directives, and components
- Feature modules are lazy-loaded via `loadChildren`

In Angular 18, these patterns would be replaced by standalone components with `providedIn: 'root'` services.

---

## Complexity Assumptions

### ~30 components in scope
Real BoA apps likely have hundreds or thousands of components. This demo is scoped to show the **types** of migration challenges, not the volume. Devin handles volume the same way — it's just more iterations.

### Mock services, not real integrations
Auth, analytics, and API calls are mocked. In production, Devin would need access to:
- Internal API documentation or Swagger/OpenAPI specs
- Auth SDK documentation
- Analytics SDK integration guides

### Single downstream consumer
BoA likely has many teams consuming the shared library. We show one to prove the pattern; the same approach scales to N consumers.

### No proprietary build tooling
We assume standard Angular CLI. BoA may use:
- Custom Webpack configurations
- Bazel build system
- Internal CI/CD pipelines with specific requirements

---

## Migration Assumptions

### Incremental upgrade path
Angular officially supports upgrading one major version at a time (14→15→16→17→18). Devin follows this path to ensure compatibility at each step.

### Tests exist but are incomplete
Matching the pre-read's description. This repo includes ~40% unit test coverage. Devin can write missing tests as a separate task, but the migration demo focuses on not breaking existing tests.

### No major breaking business logic changes
The migration should be purely technical — updating framework APIs, patterns, and dependencies without changing business behavior.

---

## What This Demo Does NOT Cover

| Topic | Reason |
|-------|--------|
| Data residency, encryption, or compliance | Infrastructure-level, not code-level |
| CI/CD pipeline changes | Though Devin can update CI configs as part of a migration |
| Performance testing or load testing | Post-migration concern |
| Accessibility audit | Component library includes a11y service stubs, but a full audit is separate |
| Real API integrations | All APIs are mocked; Devin would need Swagger specs for real APIs |
| Multiple deployment environments | We assume standard dev/staging/prod, but BoA may have more complex environments |

---

## Synthetic Data

All data in this repository is fictional:
- Account numbers (e.g., `CHK-7890-1234`) are randomly generated
- Transaction amounts and dates are fabricated
- User profiles are fictional
- API endpoints are non-functional mocks
- The "Erica" analytics SDK is a simulation of event tracking, not a real BoA service

---

## Known Limitations

1. **No real auth flow**: The SSO service simulates OIDC login without actual OAuth exchanges
2. **No WebSocket**: The alert feed uses `setInterval` polling, not real WebSocket connections
3. **No i18n completeness**: Translation files (en.json, es.json) contain only key structural translations
4. **No accessibility testing**: WCAG compliance is not verified, though basic a11y patterns are present
5. **No state management library**: Uses BehaviorSubject patterns; real apps might use NgRx/NGXS
