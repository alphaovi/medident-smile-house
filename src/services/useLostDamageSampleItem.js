// src/services/useLostDamageSampleItem.js
import { useState, useCallback } from "react";

// সরাসরি লোকাল ব্যাকএন্ড পোর্ট 5002 সেট করে দেওয়া হলো যাতে লাইভ সার্ভারের ঝামেলা না থাকে
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
          adjustmentType: payload.actionType, // "Damaged", "Lost", "Free Sample"
          quantity: Number(payload.quantity),
          note: payload.updatedBy ? `Updated by: ${payload.updatedBy}` : undefined,
          date: new Date().toISOString(),
        }
      };

      const response = await fetch(`${API_URL}/stock-adjustments/create-stock-adjustment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return {
    loading,
    error,
    getAllLostDamageSamples,
    createLostDamageSample,
  };
};