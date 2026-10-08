// src/services/supplierService.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://alphaovi-medident-backend.vercel.app/api/v1";

export const supplierService = {
  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${API_URL}/suppliers`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  },
};
