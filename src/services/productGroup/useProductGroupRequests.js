import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useProductGroupRequests = () => {
  const [loading, setLoading] = useState(false);

  // --- Group Requests ---
  const getAllGroups = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product-groups`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return [];
    }
  }, []);

  const createGroup = useCallback(async (groupPayload) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product-groups/create-product-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupPayload),
      });

      const data = await response.json();
      if (!response.ok) throw { response: { data } };
      return data.data || data;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGroup = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product-groups/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw { response: { data } };
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Subgroup Requests ---
  const getAllSubgroups = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product-subgroups`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return [];
    }
  }, []);

  const createSubgroup = useCallback(async (subgroupPayload) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product-subgroups/create-product-subgroup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subgroupPayload),
      });

      const data = await response.json();
      if (!response.ok) throw { response: { data } };
      return data.data || data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubgroup = useCallback(async (id, updatePayload) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product-subgroups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();
      if (!response.ok) throw { response: { data } };
      return data.data || data;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSubgroup = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product-subgroups/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw { response: { data } };
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getAllGroups,
    createGroup,
    deleteGroup,
    getAllSubgroups,
    createSubgroup,
    updateSubgroup,
    deleteSubgroup,
  };
};