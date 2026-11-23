import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth/auth.service";
import {
  apiRequest,
  clearAuthSession,
  getAuthToken,
  getStoredUser,
  setAuthSession,
} from "../services/auth/api";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  createUser: async () => {},
  recoverAccount: async () => {},
  verifyAccount: async () => {},
  logout: () => {},
});

const decodeTokenUser = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const resolveInitialUser = () => {
  const stored = getStoredUser();
  if (stored) return stored;
  const token = getAuthToken();
  return decodeTokenUser(token);
};

const normalizeAuthResponse = (res) => {
  const data = res?.data ?? res;
  const token =
    data?.token || data?.accessToken || res?.token || res?.accessToken || null;
  const decoded = decodeTokenUser(token);
  const rawUser =
    data?.user ||
    res?.user ||
    (data && typeof data === "object" && data.email ? data : null);

  const userObj = rawUser ? { ...decoded, ...rawUser } : decoded;
  return { data, token, userObj };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => resolveInitialUser());

  useEffect(() => {
    const syncUser = () => {
      setUser(resolveInitialUser());
    };

    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  const login = async (email, password) => {
    let rawRes = await AuthService.login?.({ email, password });

    if (!rawRes) {
      rawRes = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    }

    const { data, token, userObj } = normalizeAuthResponse(rawRes);

    if (token || userObj) {
      setAuthSession(token, userObj);
      setUser(userObj || resolveInitialUser());
    }

    return data;
  };

  const createUser = async (payload) => {
    let rawRes = await AuthService.createUser?.(payload);

    if (!rawRes) {
      rawRes = await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    const { data, token, userObj } = normalizeAuthResponse(rawRes);

    if (token || userObj) {
      setAuthSession(token, userObj);
      setUser(userObj || resolveInitialUser());
    }

    return data;
  };

  const recoverAccount = async (email) => {
    return await AuthService.recoverAccount?.(email);
  };

  const verifyAccount = async (token) => {
    return await AuthService.verifyAccount?.(token);
  };

  const logout = () => {
    AuthService.logout?.();
    clearAuthSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, createUser, recoverAccount, verifyAccount, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);