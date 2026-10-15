// purchaseOrderService.js
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1"}/purchase-orders`;

export const purchaseOrderService = {
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error("Failed to fetch purchase orders");
      const result = await response.json();
      return result.data || result.result || result;
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const formattedPayload = {
        ...orderData,
        purchaseDate: orderData.purchaseDate ? new Date(orderData.purchaseDate).toISOString() : new Date().toISOString(),
        expectedDeliveryDate: orderData.expectedDeliveryDate || orderData.expectedReceiveDate ? new Date(orderData.expectedDeliveryDate || orderData.expectedReceiveDate).toISOString() : new Date().toISOString(),
        shippingCost: Number(orderData.shippingCost) || 0,
        transitCost: Number(orderData.transitCost) || 0,
        vatValue: Number(orderData.vatValue) || 0,
        vatType: orderData.vatType === "flat" || orderData.vatType === "amount" ? "flat" : "%",
        otherCost: Number(orderData.otherCost) || 0,
        totalWeight: Number(orderData.totalWeight) || 0,
        baseSubtotal: Number(orderData.baseSubtotal || orderData.totals?.rawSubtotal) || 0,
        grandTotal: Number(orderData.grandTotal || orderData.totalAmount) || 0,
      };

      const response = await fetch(`${API_BASE_URL}/create-purchase-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => ({}));
        throw new Error(errRes.message || "Failed to create purchase order");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating purchase order:", error);
      throw error;
    }
  },

  updateOrder: async ({ id, orderData }) => {
    try {
      const formattedPayload = {
        ...orderData,
        expectedDeliveryDate: orderData.expectedDeliveryDate || orderData.expectedReceiveDate ? new Date(orderData.expectedDeliveryDate || orderData.expectedReceiveDate).toISOString() : undefined,
        shippingCost: Number(orderData.shippingCost) || 0,
        transitCost: Number(orderData.transitCost) || 0,
        vatValue: Number(orderData.vatValue) || 0,
        vatType: orderData.vatType === "flat" || orderData.vatType === "amount" ? "flat" : "%",
        otherCost: Number(orderData.otherCost) || 0,
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
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