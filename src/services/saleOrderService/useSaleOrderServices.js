const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";
// const API_URL = "http://localhost:5002/api/v1";

// 🟢 1. Create Sale Order with Direct Local Backend URL & Console Logs
export const createSaleOrder = async (saleData) => {
  // console.log("🚀 [FRONTEND] createSaleOrder called with raw saleData:", saleData);

  const formattedProducts = saleData.products?.map((item) => {
    const productId = item.product?._id || item.product?.id || item.product;
    const groupId = item.group?._id || item.group?.id || item.group;
    const subGroupId = item.subGroup?._id || item.subGroup?.id || item.subGroup;

    return {
      ...item,
      product: productId,
      group: groupId,
      subGroup: subGroupId,
    };
  });

  const payload = {
    ...saleData,
    products: formattedProducts,
  };

  // console.log("📦 [FRONTEND] Final Payload sent to backend:", JSON.stringify(payload, null, 2));

  const response = await fetch(`${API_URL}/sales-orders/create-sale-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ saleOrder: payload }),
  });

  const data = await response.json();
  console.log("📥 [FRONTEND] Response received from backend:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to create sale order");
  }

  return data;
};

// 🟢 2. Fetch All Sale Orders
export const fetchSaleOrders = async () => {
  const response = await fetch(`${API_URL}/sales-orders`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sale orders");
  }
  return Array.isArray(data) ? data : (data?.data || data?.result || []);
};

// 🟢 3. Update Order Status
export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/sales-orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status");
  }

  return data;
};

// 🟢 4. Update Sale Order Details (Using PATCH)
export const updateSaleOrder = async (id, saleData) => {
  const formattedProducts = saleData.products?.map((item) => ({
    ...item,
    product: item.product?._id || item.product?.id || item.product,
    group: item.group?._id || item.group?.id || item.group,
    subGroup: item.subGroup?._id || item.subGroup?.id || item.subGroup,
  }));

  const payload = {
    ...saleData,
    products: formattedProducts,
  };

  const response = await fetch(`${API_URL}/sales-orders/${id}`, {
    method: "PATCH", // 🟢 PUT থেকে PATCH করা হলো
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ saleOrder: payload }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update sale order");
  }

  return data;
};

// 🟢 5. Delete Sale Order
export const deleteSaleOrder = async (id) => {
  const response = await fetch(`${API_URL}/sales-orders/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete sale order");
  }

  return data;
};

// 🟢 6. Fetch Sale Dependencies & Inventory Sync
export const fetchSaleDependencies = async () => {
  try {
    const [statesRes, custRes, prodRes, groupRes, subGroupRes, invRes] = await Promise.all([
      fetch(`${API_URL}/states`).catch(() => null),
      fetch(`${API_URL}/customers`).catch(() => null),
      fetch(`${API_URL}/products`).catch(() => null),
      fetch(`${API_URL}/product-groups`).catch(() => null),
      fetch(`${API_URL}/product-subgroups`).catch(() => null),
      fetch(`${API_URL}/inventory`).catch(() => null),
    ]);

    const states = statesRes && statesRes.ok ? await statesRes.json() : [];
    const customers = custRes && custRes.ok ? await custRes.json() : [];
    const productsRaw = prodRes && prodRes.ok ? await prodRes.json() : [];
    const groups = groupRes && groupRes.ok ? await groupRes.json() : [];
    const subgroups = subGroupRes && subGroupRes.ok ? await subGroupRes.json() : [];
    const inventoriesRaw = invRes && invRes.ok ? await invRes.json() : [];

    const productsList = Array.isArray(productsRaw) ? productsRaw : (productsRaw?.data || []);
    const invList = Array.isArray(inventoriesRaw) ? inventoriesRaw : (inventoriesRaw?.data || []);

    const mergedProducts = productsList.map((prod) => {
      const pId = prod._id || prod.id;
      const matchedInv = invList.find((inv) => {
        const invProdId = typeof inv.product === "object" ? (inv.product?._id || inv.product?.id) : inv.product;
        return String(invProdId) === String(pId) || String(inv._id) === String(pId);
      });

      const actualStock = matchedInv?.currentStock !== undefined 
        ? Number(matchedInv.currentStock) 
        : (prod.currentStock !== undefined ? Number(prod.currentStock) : Number(prod.quantity || 0));

      return {
        ...prod,
        currentStock: actualStock,
      };
    });

    return {
      states: Array.isArray(states) ? states : (states?.data || []),
      customers: Array.isArray(customers) ? customers : (customers?.data || []),
      products: mergedProducts,
      productsGroupSubgroup: Array.isArray(groups) ? groups : (groups?.data || []),
      subgroups: Array.isArray(subgroups) ? subgroups : (subgroups?.data || []),
    };
  } catch (error) {
    console.error("Error fetching sale dependencies:", error);
    throw error;
  }
};

// 🟢 7. Add Payment to Sale Order
export const addPaymentToSaleOrder = async (id, paymentPayload) => {
  const response = await fetch(`${API_URL}/sales-orders/${id}/payment`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentPayload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to record payment");
  }

  return data;
};

export const useSaleOrderServices = {
  createSaleOrder,
  getAllSaleOrders: fetchSaleOrders,
  fetchSaleOrders,
  updateOrderStatus,
  updateSaleOrder,
  deleteSaleOrder,
  fetchSaleDependencies,
  addPaymentToSaleOrder,
};