export const AUTH_STORAGE_KEY = "isAuthenticated";
export const USER_DATA_KEY = "userData";
const LAST_ACTIVITY_KEY = "lastActivity";
const SESSION_EXPIRY_KEY = "sessionExpiry";

export const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_CHECK_BUFFER_MS = 500; // buffer to avoid premature expiry due to timing differences

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
};

export const initializeSession = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(AUTH_STORAGE_KEY, "true");
  touchSession();
};

export const touchSession = () => {
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

export const isSessionActive = () => {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  if (storage.getItem(AUTH_STORAGE_KEY) !== "true") {
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

export const clearSession = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(AUTH_STORAGE_KEY);
  storage.removeItem(USER_DATA_KEY);
  storage.removeItem(LAST_ACTIVITY_KEY);
  storage.removeItem(SESSION_EXPIRY_KEY);
};

