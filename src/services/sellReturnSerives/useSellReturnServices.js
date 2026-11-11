// src/services/sellReturnService/useSellReturnServices.js
import axios from "axios";

// 🟢 এনভায়রনমেন্ট ভেরিয়েবল বা লোকাল পোর্ট সেটআপ
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";

const SELL_RETURNS_ENDPOINT = `${API_URL}/sell-returns`;

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