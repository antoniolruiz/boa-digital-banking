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
  DEVIN_API_TOKEN: '',

  // GitHub personal access token (for repository scanning).
  // For Devin sessions: use the $GITHUB_TOKEN secret.
  // Needs 'repo' scope for private repos, or 'public_repo' for public repos.
  // Generate at: https://github.com/settings/tokens
  GITHUB_TOKEN: '',

  // Devin API base URL (v1). Change only if using a proxy.
  DEVIN_API_BASE: 'https://api.devin.ai/v1'

};
