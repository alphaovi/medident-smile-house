// src/services/customerService.js

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_Test_API_URL || 
  "https://alphaovi-medident-backend.vercel.app/api/v1"; // আপনার লাইভ ব্যাকএন্ড ইউআরএল ফলব্যাক হিসেবে যুক্ত করা হলো

export const customerService = {
  getAllCustomers: async (division = "") => {
    const url = division 
      ? `${API_BASE_URL}/customers?division=${encodeURIComponent(division)}` 
      : `${API_BASE_URL}/customers`;
    
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch customers");
    return data.data;
  },

  createCustomer: async (customerPayload) => {
    const response = await fetch(`${API_BASE_URL}/customers/create-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerPayload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create customer");
    return data.data;
  },

  updateCustomer: async (id, updatedData) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: updatedData }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update customer");
    return data.data;
  },

  deleteCustomer: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete customer");
    return data.data;
  },
};