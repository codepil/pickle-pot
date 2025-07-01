/**
 * Authentication utilities
 */

export const authTokenKey = "auth_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(authTokenKey);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(authTokenKey, token);
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(authTokenKey);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Check if the current auth token is expired
 * This is a simple check - in a real app you'd decode the JWT
 */
export function isTokenExpired(): boolean {
  const token = getAuthToken();
  if (!token) return true;

  try {
    // Simple JWT expiration check (you might want to use a JWT library)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;

    if (!exp) return false; // No expiration

    return Date.now() >= exp * 1000;
  } catch {
    return true; // Invalid token format
  }
}
