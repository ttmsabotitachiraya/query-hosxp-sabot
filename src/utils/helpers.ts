// utils/helpers.ts

/**
 * Returns true if updated_at exists and differs from created_at by at least 1 second.
 * Mirrors the original hasMeaningfulUpdate logic from app.js / admin.js.
 */
export function hasMeaningfulUpdate(
  createdAt: string,
  updatedAt: string | null,
): boolean {
  if (!updatedAt) return false;
  if (!createdAt) return true;
  try {
    const c = new Date(createdAt).getTime();
    const u = new Date(updatedAt).getTime();
    if (isNaN(c) || isNaN(u)) return true; // if parse fails, show it to be safe
    return Math.abs(u - c) >= 1000; // at least 1 second difference
  } catch (_e: unknown) {
    return true;
  }
}
