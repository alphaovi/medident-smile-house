// purchaseOrderService.js
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1"}/purchase-orders`;

export const purchaseOrderService = {
  // Get all purchase orders
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error("Failed to fetch purchase orders");
      return await response.json();
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      throw error;
    }
  },

  // Create a new purchase order -> POST /api/v1/purchase-orders/create-purchase-order
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-purchase-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to create purchase order");
      return await response.json();
    } catch (error) {
      console.error("Error creating purchase order:", error);
      throw error;
    }
  },

  // Update an existing purchase order (PATCH method with error response catch)
  updateOrder: async (id, orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => ({}));
        throw new Error(errRes.message || "Failed to update purchase order");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating purchase order:", error);
      throw error;
    }
  },

  // Delete a purchase order
  deleteOrder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete purchase order");
      return await response.json();
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      throw error;
    }
  },
};
