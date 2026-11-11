import axios from "axios";

// Get base URL from environment variables, fallback to local backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";


export const useInventoryManagementService = () => {
  // Fetch all inventories from backend
  const getAllInventories = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory`);
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

  // Update Inventory Price / Details API Call
  const updateInventoryPrice = async (productId, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/inventory/${productId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  return {
    getAllInventories,
    getSingleInventory,
    updateInventoryPrice,
  };
};