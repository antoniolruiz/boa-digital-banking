/**
 * Migration Dashboard Configuration
 * ===================================
 *
 * Copy this file to config.js and fill in your values:
 *
 *   cp config.example.js config.js
 *
 * config.js is git-ignored to prevent accidental token commits.
 */
window.MIGRATION_CONFIG = {

  // Your Devin API bearer token.
  // Generate at: https://app.devin.ai/settings/api-tokens
  DEVIN_API_TOKEN: '',

  // GitHub personal access token (for repository scanning).
  // Needs 'repo' scope for private repos, or 'public_repo' for public repos.
  // Generate at: https://github.com/settings/tokens
  GITHUB_TOKEN: '',

  // Devin API base URL (v1). Change only if using a proxy.
  DEVIN_API_BASE: 'https://api.devin.ai/v1'

};
