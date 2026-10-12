import axios from "axios";

// Get base URL from environment variables, fallback to Vercel live backend URL
const API_URL = import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1";

export const useInventoryManagementService = () => {
  // Fetch all inventories from backend
  const getAllInventories = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  // Fetch single inventory by product ID
  const getSingleInventory = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/inventory/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  return {
    getAllInventories,
    getSingleInventory,
  };
};