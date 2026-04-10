/**
 * Migration Dashboard Configuration — EXAMPLE
 * =============================================
 *
 * Copy this file to config.js and fill in your values:
 *
 *   cp config.example.js config.js
 *
 * config.js is git-ignored to prevent accidental token commits.
 *
 * See config.example.js comments below for setup details.
 */
window.MIGRATION_CONFIG = {

  // Your Devin API bearer token.
  // Generate at: https://app.devin.ai/settings/api-tokens
  DEVIN_API_TOKEN: '',

  // Devin API base URL (v1). Change only if using a proxy.
  DEVIN_API_BASE: 'https://api.devin.ai/v1',

  // Base URL for your repository scan microservice (optional).
  // Leave empty to use the built-in simulation engine.
  SCAN_API_BASE: '',

  // true  = runs fully offline with simulated data (default)
  // false = makes real API calls to the endpoints above
  USE_SIMULATION: true

};
