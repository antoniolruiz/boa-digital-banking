/**
 * Migration Dashboard Configuration
 * ===================================
 *
 * Copy this file to config.js and fill in your values:
 *
 *   cp config.example.js config.js
 *
 * config.js is git-ignored to prevent accidental token commits.
 *
 * If running via Devin, secrets are available as environment variables:
 *   - $SERVICE_ANTONIO  → use as DEVIN_API_TOKEN
 *   - $GITHUB_TOKEN     → use as GITHUB_TOKEN
 */
window.MIGRATION_CONFIG = {

  // Your Devin API bearer token (Devin service token).
  // For Devin sessions: use the $SERVICE_ANTONIO secret.
  // Generate at: https://app.devin.ai/settings/api-tokens
  DEVIN_API_TOKEN: 'YOUR_DEVIN_API_TOKEN_HERE',

  // GitHub personal access token (for repository scanning).
  // For Devin sessions: use the $GITHUB_TOKEN secret.
  // Needs 'repo' scope for private repos, or 'public_repo' for public repos.
  // Generate at: https://github.com/settings/tokens
  GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE',

  // Local CORS proxy (run: node migration-dashboard/proxy.js)
  // Change to 'https://api.devin.ai/v1' if not using the proxy.
  DEVIN_API_BASE: 'http://localhost:4203'

};
