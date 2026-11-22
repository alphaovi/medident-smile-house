import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth/auth.service";
import {
  apiRequest,
  clearAuthSession,
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  const login = async (email, password) => {
    let data = await AuthService.login?.({ email, password });

    if (!data) {
      const res = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      data = res?.data ?? res;
    }

    if (data?.token && data?.user) {
      setAuthSession(data.token, data.user);
      setUser(data.user);
    }

    return data;
  };

  const createUser = async (payload) => {
    let data = await AuthService.createUser?.(payload);

    if (!data) {
      const res = await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      data = res?.data ?? res;
    }

    if (data?.token && data?.user) {
      setAuthSession(data.token, data.user);
      setUser(data.user);
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