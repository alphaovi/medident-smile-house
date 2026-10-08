// src/services/useEmployeeServices.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";

export const employeeSettingService = {
  getAllEmployees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch employees");
      }
      return data.data; // ব্যাকএন্ড রেসপন্সের data প্রপার্টি রিটার্ন করবে[cite: 3]
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },
};