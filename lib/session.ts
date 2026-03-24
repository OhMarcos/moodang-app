"use client";

const SESSION_KEY = "moodang_session_id";

/**
 * Get or create a persistent session ID (stored in localStorage).
 * Used to link anonymous readings without requiring auth.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
