/**
 * Environment variable validation.
 * Call at API route entry to fail fast with clear messages.
 */

const REQUIRED_VARS = [
  "GOOGLE_AI_API_KEY",
] as const;

const OPTIONAL_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
] as const;

let _validated = false;
const _missing: string[] = [];

/**
 * Validate required environment variables on first call.
 * Returns { ok, missing } — caller decides how to handle.
 */
export function validateEnv(): { ok: boolean; missing: string[] } {
  if (_validated) {
    return { ok: _missing.length === 0, missing: _missing };
  }

  _validated = true;

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      _missing.push(key);
    }
  }

  // Log warnings for optional vars
  for (const key of OPTIONAL_VARS) {
    if (!process.env[key]) {
      console.warn(`[env] Optional var ${key} not set — related features disabled`);
    }
  }

  if (_missing.length > 0) {
    console.error(`[env] Missing required environment variables: ${_missing.join(", ")}`);
  }

  return { ok: _missing.length === 0, missing: _missing };
}
