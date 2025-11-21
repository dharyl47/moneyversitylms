export const AUTH_STORAGE_KEY = "isAuthenticated";
export const USER_DATA_KEY = "userData";
export const JWT_TOKEN_KEY = "authToken";
const LAST_ACTIVITY_KEY = "lastActivity";
const SESSION_EXPIRY_KEY = "sessionExpiry";

export const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours (JWT expiry)
const SESSION_CHECK_BUFFER_MS = 500; // buffer to avoid premature expiry due to timing differences

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
};

interface UserData {
  username?: string;
  type?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Initialize session with JWT token
 * @param token - JWT token
 * @param userData - User data
 */
export const initializeSession = (token: string | null, userData?: UserData | null): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(AUTH_STORAGE_KEY, "true");
  if (token) {
    storage.setItem(JWT_TOKEN_KEY, token);
  }
  
  if (userData) {
    storage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
  
  touchSession();
};

/**
 * Get JWT token from storage
 * @returns JWT token or null
 */
export const getToken = (): string | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  return storage.getItem(JWT_TOKEN_KEY);
};

/**
 * Get authorization header value
 * @returns Authorization header value or null
 */
export const getAuthHeader = (): string | null => {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
};

export const touchSession = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  if (storage.getItem(AUTH_STORAGE_KEY) !== "true") {
    return;
  }

  const now = Date.now();
  storage.setItem(LAST_ACTIVITY_KEY, now.toString());
  storage.setItem(SESSION_EXPIRY_KEY, (now + SESSION_TIMEOUT_MS).toString());
};

export const isSessionActive = (): boolean => {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  if (storage.getItem(AUTH_STORAGE_KEY) !== "true") {
    return false;
  }

  const token = storage.getItem(JWT_TOKEN_KEY);
  if (!token) {
    return false;
  }

  const expiryValue = storage.getItem(SESSION_EXPIRY_KEY);
  if (!expiryValue) {
    return false;
  }

  const expiry = Number(expiryValue);
  if (Number.isNaN(expiry)) {
    return false;
  }

  return Date.now() + SESSION_CHECK_BUFFER_MS <= expiry;
};

export const clearSession = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_STORAGE_KEY);
  storage.removeItem(USER_DATA_KEY);
  storage.removeItem(JWT_TOKEN_KEY);
  storage.removeItem(LAST_ACTIVITY_KEY);
  storage.removeItem(SESSION_EXPIRY_KEY);
};

