// src/services/useStateService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";

export const stateService = {
  getAllStates: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/states`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch states");
      }
      return data; // এটি সরাসরি স্টেট অ্যারে রিটার্ন করবে[cite: 9]
    } catch (error) {
      console.error("Error fetching states:", error);
      throw error;
    }
  },
};