// src/services/saleOrderService/useSaleOrderServices.js
import { customerService } from "../useCustomerService/useCustomerService";
import { stateService } from "../useStateService/useStateService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";

// Individual Named Exports (Jate CreateSale.jsx ba onno kothao direct import korar shomoy error na ashe)
export const fetchSaleDependencies = async () => {
  try {
    const [statesData, customersData, prodRes, groupRes, subgroupRes] = await Promise.all([
      stateService.getAllStates().catch(() => []),
      customerService.getAllCustomers().catch(() => []),
      fetch(`${API_URL}/products`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/product-groups`).catch(() => ({ ok: false })),
      fetch(`${API_URL}/product-subgroups`).catch(() => ({ ok: false })),
    ]);

    const states = Array.isArray(statesData) ? statesData : (statesData?.data || statesData?.result || []);
    const customers = Array.isArray(customersData) ? customersData : (customersData?.data || customersData?.result || []);
    
    const prodJson = prodRes.ok ? await prodRes.json() : [];
    const products = Array.isArray(prodJson) ? prodJson : (prodJson?.data || prodJson?.result || []);

    const groupJson = groupRes.ok ? await groupRes.json() : [];
    const groups = Array.isArray(groupJson) ? groupJson : (groupJson?.data || groupJson?.result || []);

    const subgroupJson = subgroupRes.ok ? await subgroupRes.json() : [];
    const subgroups = Array.isArray(subgroupJson) ? subgroupJson : (subgroupJson?.data || subgroupJson?.result || []);

    return { 
      states, 
      customers, 
      products, 
      productsGroupSubgroup: groups, 
      subgroups 
    };
  } catch (error) {
    console.error("Error fetching sale dependencies:", error);
    throw error;
  }
};

export const createSaleOrder = async (saleData) => {
  const response = await fetch(`${API_URL}/sale-orders/create-sale-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ saleOrder: saleData }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create sale order");
  }

  return data;
};

export const getAllSaleOrders = async () => {
  const response = await fetch(`${API_URL}/sale-orders`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sale orders");
  }
  return data.data || data;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await fetch(`${API_URL}/sale-orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus.toLowerCase() }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status");
  }

  return data;
};

export const deleteSaleOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/sale-orders/${orderId}`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete sale order");
  }

  return data;
};

// Object Export (Jodi keu object hishebe use korte chay)
export const useSaleOrderServices = {
  fetchSaleDependencies,
  createSaleOrder,
  getAllSaleOrders,
  updateOrderStatus,
  deleteSaleOrder,
};