/**
 * Token storage helper — see 08_SECURITY.md § Token Storage.
 *
 * Access token lives in memory only. Refresh token is also kept in memory,
 * backed by `sessionStorage` (never `localStorage`) so a page refresh does not
 * force an immediate logout. Nothing outside this module may read or write
 * tokens directly — see 01_AGENTS.md § Authentication Rules: "No token logic
 * inside UI components."
 */

const REFRESH_TOKEN_SESSION_KEY = 'mobileShopErp.refreshToken';

let accessTokenMemory: string | null = null;
let refreshTokenMemory: string | null = readRefreshTokenFromSession();

function readRefreshTokenFromSession(): string | null {
  try {
    return sessionStorage.getItem(REFRESH_TOKEN_SESSION_KEY);
  } catch {
    return null;
  }
}

function writeRefreshTokenToSession(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(REFRESH_TOKEN_SESSION_KEY, token);
    } else {
      sessionStorage.removeItem(REFRESH_TOKEN_SESSION_KEY);
    }
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing) — memory-only fallback.
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return accessTokenMemory;
  },
  getRefreshToken(): string | null {
    return refreshTokenMemory;
  },
  setTokens(accessToken: string, refreshToken: string): void {
    accessTokenMemory = accessToken;
    refreshTokenMemory = refreshToken;
    writeRefreshTokenToSession(refreshToken);
  },
  clear(): void {
    accessTokenMemory = null;
    refreshTokenMemory = null;
    writeRefreshTokenToSession(null);
  },
};
