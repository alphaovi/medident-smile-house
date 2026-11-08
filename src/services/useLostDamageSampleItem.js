import { useState, useCallback } from "react";

const API_URL = "http://localhost:5002/api/v1";

export const useLostDamageSampleItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllLostDamageSamples = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/stock-adjustments`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch records");
      }
      return data.data || data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createLostDamageSample = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const formattedPayload = {
        stockAdjustment: {
          product: payload.productId, 
          adjustmentType: payload.actionType,
          quantity: Number(payload.quantity),
          referredBy: payload.referredBy || "",
          updatedBy: payload.updatedBy || "",
          // Free Sample হলে কাস্টমার আইডি পাঠানো হচ্ছে
          customer: payload.actionType === "Free Sample" ? payload.customer : undefined,
          date: new Date().toISOString(),
        }
      };

      const response = await fetch(`${API_URL}/stock-adjustments/create-stock-adjustment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create record");
      }
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateLostDamageSample = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const formattedPayload = {
        stockAdjustment: {
          product: payload.productId, 
          adjustmentType: payload.actionType,
          quantity: Number(payload.quantity),
          referredBy: payload.referredBy || "",
          updatedBy: payload.updatedBy || "",
          // Free Sample হলে কাস্টমার আইডি পাঠানো হচ্ছে
          customer: payload.actionType === "Free Sample" ? payload.customer : undefined,
        }
      };

      const response = await fetch(`${API_URL}/stock-adjustments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update record");
      }
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllLostDamageSamples,
    createLostDamageSample,
    updateLostDamageSample,
  };
};