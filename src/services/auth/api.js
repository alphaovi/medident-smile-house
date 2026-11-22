const rawBaseUrl =
  import.meta.env.VITE_Test_API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5002/api/v1";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const SESSION_STORAGE_KEY = "medident_session_v1";
const ACTIVE_TIMEOUT_MS = 3 * 60 * 60 * 1000; // 3 hours while active
const CLOSED_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours after closing/leaving page

let expiryCheckIntervalId = null;

if (typeof window !== "undefined" && !window.__MEDIDENT_AUTH__) {
  window.__MEDIDENT_AUTH__ = {
    token: null,
    user: null,
  };
}

const notifyAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-change", { detail: window.__MEDIDENT_AUTH__ }));
  }
};

const readRawSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage read errors
  }

  if (
    typeof window !== "undefined" &&
    (window.__MEDIDENT_AUTH__?.token || window.__MEDIDENT_AUTH__?.user)
  ) {
    return {
      token: window.__MEDIDENT_AUTH__.token,
      user: window.__MEDIDENT_AUTH__.user,
      lastActivityAt: Date.now(),
      closedAt: null,
    };
  }

  return null;
};

const writeRawSession = (session) => {
  if (typeof window !== "undefined") {
    window.__MEDIDENT_AUTH__ = {
      token: session?.token || null,
      user: session?.user || null,
    };
  }

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage write errors
  }
};

export const clearAuthSession = () => {
  if (typeof window !== "undefined") {
    window.__MEDIDENT_AUTH__ = {
      token: null,
      user: null,
    };
  }

  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage remove errors
  }

  notifyAuthChange();
};

const isSessionValid = (session) => {
  if (!session || (!session.token && !session.user)) return false;

  const now = Date.now();
  const lastActivityAt = session.lastActivityAt || now;
  const closedAt = session.closedAt || null;

  if (now - lastActivityAt >= ACTIVE_TIMEOUT_MS) {
    return false;
  }

  if (closedAt && now - closedAt >= CLOSED_TIMEOUT_MS) {
    return false;
  }

  return true;
};

export const getValidSession = () => {
  const session = readRawSession();
  if (!session) return null;

  if (!isSessionValid(session)) {
    clearAuthSession();
    return null;
  }

  if (typeof window !== "undefined") {
    window.__MEDIDENT_AUTH__ = {
      token: session.token || null,
      user: session.user || null,
    };
  }

  return session;
};

export const markUserActive = () => {
  const session = getValidSession();
  if (!session) return;

  writeRawSession({
    ...session,
    lastActivityAt: Date.now(),
    closedAt: null,
  });
};

const markPageClosedOrAway = () => {
  const session = getValidSession();
  if (!session) return;

  writeRawSession({
    ...session,
    closedAt: session.closedAt || Date.now(),
  });
};

export const getAuthToken = () => {
  const session = getValidSession();
  return session?.token || null;
};

export const getStoredUser = () => {
  const session = getValidSession();
  return session?.user || null;
};

export const setAuthSession = (token, user) => {
  const now = Date.now();
  const existing = readRawSession();

  const resolvedToken = token ?? existing?.token ?? null;
  const resolvedUser = user ?? existing?.user ?? null;

  const nextSession = {
    token: resolvedToken,
    user: resolvedUser,
    lastActivityAt: now,
    closedAt: null,
  };

  writeRawSession(nextSession);
  notifyAuthChange();
};

if (typeof window !== "undefined") {
  const handlePageOpenOrFocus = () => {
    const session = getValidSession();
    if (!session) return;
    writeRawSession({
      ...session,
      lastActivityAt: Date.now(),
      closedAt: null,
    });
    notifyAuthChange();
  };

  const handleActivity = () => {
    markUserActive();
  };

  const handleLeave = () => {
    markPageClosedOrAway();
  };

  window.addEventListener("mousemove", handleActivity, { passive: true });
  window.addEventListener("keydown", handleActivity, { passive: true });
  window.addEventListener("click", handleActivity, { passive: true });
  window.addEventListener("scroll", handleActivity, { passive: true });
  window.addEventListener("touchstart", handleActivity, { passive: true });

  window.addEventListener("focus", handlePageOpenOrFocus);
  window.addEventListener("pageshow", handlePageOpenOrFocus);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      handlePageOpenOrFocus();
    } else {
      handleLeave();
    }
  });
  window.addEventListener("pagehide", handleLeave);
  window.addEventListener("beforeunload", handleLeave);

  if (!expiryCheckIntervalId) {
    expiryCheckIntervalId = setInterval(() => {
      const session = readRawSession();
      if (session && !isSessionValid(session)) {
        clearAuthSession();
      }
    }, 30 * 1000);
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  markUserActive();
  return data;
};