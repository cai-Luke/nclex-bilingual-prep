// Shared text normalization for the TTS pipeline.
//
// This is the contract between the (offline) generation pass and the runtime
// resolver: both must import THIS function so a string hashes identically on
// both sides. Keep it runtime-safe — no node imports — so the browser app can
// import it too. See Archive/root-cleanup-2026-06-24/tts-queue-builder-codex-spec.md
// and DECISIONS principle 20.

/**
 * Normalize a voiceable string before hashing/synthesis.
 *
 * Content-preserving except for whitespace: trims the ends and collapses every
 * internal run of whitespace (spaces, tabs, newlines) to a single ASCII space.
 * Chinese characters, punctuation, and casing are left untouched.
 */
export function normalizeForTts(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
