import axios from "axios";

// Get base URL from environment variables, fallback to local backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const useInventoryManagementService = () => {
  // Fetch all inventories from backend
  const getAllInventories = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory`);
      // Return the array directly whether wrapped in .data or not
      const rawData = response.data;
      return Array.isArray(rawData) ? rawData : (rawData?.data || rawData?.result || []);
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