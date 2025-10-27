// @ts-nocheck
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { get, post } from "../services/api";

const SESSION_STORAGE_KEY = "lets-travel:auth-session";

const AuthContext = createContext(null);

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredSession() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to read auth session from storage", error);
    return null;
  }
}

function persistSession(user) {
  if (!isBrowser()) {
    return;
  }

  if (!user) {
    clearStoredSession();
    return;
  }

  try {
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ user })
    );
  } catch (error) {
    console.error("Failed to persist auth session", error);
  }
}

function clearStoredSession() {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear auth session", error);
  }
}

function normalizeUser(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  if (data.user && typeof data.user === "object") {
    return data.user;
  }

  if (data.data && typeof data.data === "object") {
    const nested = data.data;
    if (nested.user && typeof nested.user === "object") {
      return nested.user;
    }
    if (!Array.isArray(nested)) {
      return nested;
    }
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleAuthSuccess = useCallback((nextUser) => {
    setUser(nextUser);
    setStatus("authenticated");
    setError(null);
    persistSession(nextUser);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const response = await get("/api/me");
    const nextUser = normalizeUser(response);

    if (!nextUser) {
      throw new Error("No user information returned from /api/me");
    }

    handleAuthSuccess(nextUser);
    return nextUser;
  }, [handleAuthSuccess]);

  useEffect(() => {
    const stored = readStoredSession();

    if (stored?.user) {
      setUser(stored.user);
      setStatus("loading");

      fetchCurrentUser().catch((err) => {
        console.error("Failed to validate stored session", err);
        clearStoredSession();
        setUser(null);
        setStatus("unauthenticated");
      });
    } else {
      setStatus("unauthenticated");
    }
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (credentials) => {
      setStatus("loading");
      setError(null);

      try {
        await post("/api/login", credentials);
        await fetchCurrentUser();
      } catch (err) {
        setError(err);
        clearStoredSession();
        setUser(null);
        setStatus("unauthenticated");
        throw err;
      }
    },
    [fetchCurrentUser]
  );

  const logout = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      await post("/api/logout", {});
    } catch (err) {
      console.error("Error logging out", err);
    } finally {
      clearStoredSession();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const refresh = useCallback(async () => {
    setStatus("loading");

    try {
      await fetchCurrentUser();
    } catch (err) {
      setError(err);
      clearStoredSession();
      setUser(null);
      setStatus("unauthenticated");
      throw err;
    }
  }, [fetchCurrentUser]);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      refresh,
    }),
    [user, status, error, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
