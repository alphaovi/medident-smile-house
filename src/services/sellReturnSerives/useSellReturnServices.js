// src/services/sellReturnService/useSellReturnServices.js
import axios from "axios";

// আপনার লোকাল ব্যাকএন্ডের সঠিক পোর্ট এখানে বসাবেন (যেমন 5002 হলে 5002, অন্যথায় 5000)
const API_BASE_URL = 
  import.meta.env.DEV 
    ? "http://localhost:5002/api/v1" 
    : "https://alphaovi-medident-backend.vercel.app/api/v1";

const SELL_RETURNS_ENDPOINT = `${API_BASE_URL}/sell-returns`;

export const useSellReturnServices = {
  createSellReturn: async (payload) => {
    try {
      const response = await axios.post(SELL_RETURNS_ENDPOINT, payload);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create sell return"
      );
    }
  },

  getAllSellReturns: async () => {
    try {
      const response = await axios.get(SELL_RETURNS_ENDPOINT);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch sell returns"
      );
    }
  },

  updateSellReturn: async (id, payload) => {
    try {
      const response = await axios.put(`${SELL_RETURNS_ENDPOINT}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update sell return"
      );
    }
  },
};