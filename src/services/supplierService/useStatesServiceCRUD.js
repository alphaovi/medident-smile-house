import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/states`;

export const useStatesServiceCRUD = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all states (GET)
  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch states");

      const rawData = result.data || result;
      const formattedData = (Array.isArray(rawData) ? rawData : []).map((item) => ({
        ...item,
        id: item._id || item.id,
      }));

      setStates(formattedData);
    } catch (err) {
      console.error(err);
      toast.error("Could not load states from server!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Create State (POST without Auth Headers)
  const addState = async (stateName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/create-state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ডেটা পাঠানোর জন্য শুধু Content-Type রাখা হয়েছে
        },
        body: JSON.stringify({ stateName }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.error || result.message || "Failed to create state"
        );

      const newItem = result.data || result;
      setStates((prev) => [{ ...newItem, id: newItem._id || newItem.id }, ...prev]);
      toast.success("State added successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add state");
      return false;
    }
  };

  // Update State (PATCH without Auth Headers)
  const updateState = async (id, stateName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stateName }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.error || result.message || "Failed to update state"
        );

      setStates((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id ? { ...item, stateName } : item
        )
      );
      toast.success("State updated successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update state");
      return false;
    }
  };

  // Delete State (DELETE without Auth Headers)
  const deleteState = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.error || result.message || "Failed to delete state"
        );

      setStates((prev) =>
        prev.filter((item) => item._id !== id && item.id !== id)
      );
      toast.info("State deleted successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Could not delete state!");
      return false;
    }
  };

  return {
    states,
    loading,
    addState,
    updateState,
    deleteState,
    refreshStates: fetchStates,
  };
};