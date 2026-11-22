import { apiRequest, clearAuthSession, getStoredUser, setAuthSession } from "./api";

export const AuthService = {
  createUser: async (payload) => {
    const res = await apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.data?.token && res.data?.user) {
      setAuthSession(res.data.token, res.data.user);
    }
    return res.data ?? res;
  },

  verifyAccount: async (token) => {
    const res = await apiRequest(
      `/users/verify-account?token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );
    return res.data ?? res;
  },

  login: async (payload) => {
    const res = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.data?.token && res.data?.user) {
      setAuthSession(res.data.token, res.data.user);
    }
    return res.data ?? res;
  },

  recoverAccount: async (email) => {
    const res = await apiRequest("/users/recover-account", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return res.data ?? res;
  },

  getMe: async () => {
    const res = await apiRequest("/users/me");
    return res.data ?? res;
  },

  getAllUsers: async () => {
    const res = await apiRequest("/users");
    return res.data ?? res;
  },

  getCurrentUser: () => {
    return getStoredUser();
  },

  logout: () => {
    clearAuthSession();
  },
};