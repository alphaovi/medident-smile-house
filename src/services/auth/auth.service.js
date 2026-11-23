import { apiRequest, clearAuthSession, getStoredUser, setAuthSession } from "./api";

const extractAuthPayload = (res) => {
  const data = res?.data ?? res;
  const token =
    data?.token || data?.accessToken || res?.token || res?.accessToken || null;
  const user = data?.user || res?.user || null;
  return { data, token, user };
};

export const AuthService = {
  createUser: async (payload) => {
    const res = await apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const { data, token, user } = extractAuthPayload(res);
    if (token || user) {
      setAuthSession(token, user);
    }
    return data;
  },

  verifyAccount: async (token) => {
    const res = await apiRequest(
      `/users/verify-account?token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );
    return res?.data ?? res;
  },

  login: async (payload) => {
    const res = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const { data, token, user } = extractAuthPayload(res);
    if (token || user) {
      setAuthSession(token, user);
    }
    return data;
  },

  recoverAccount: async (email) => {
    const res = await apiRequest("/users/recover-account", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return res?.data ?? res;
  },

  getMe: async () => {
    const res = await apiRequest("/users/me");
    return res?.data ?? res;
  },

  getAllUsers: async () => {
    const res = await apiRequest("/users");
    return res?.data ?? res;
  },

  approveAndAssignRole: async (userId, role) => {
    const res = await apiRequest(`/users/${userId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    return res?.data ?? res;
  },

  updateUserActiveStatus: async (userId, isActive) => {
    const res = await apiRequest(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
    return res?.data ?? res;
  },

  getCurrentUser: () => getStoredUser(),
  logout: () => clearAuthSession(),
};