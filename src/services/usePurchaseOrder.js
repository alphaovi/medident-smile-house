import { useState, useEffect, useCallback } from "react";

// আপনার ব্যাকএন্ড সার্ভারের বেস URL (অন্যান্য সার্ভিসের মতো)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";

export const usePurchaseOrder = (orderId, products = []) => {
  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ব্যাকএন্ড থেকে নির্দিষ্ট পারচেজ অর্ডার ফেচ করার ফাংশন
  const fetchOrderData = useCallback(async () => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/purchase-orders/${orderId}`); // আপনার ব্যাকএন্ড রাউট অনুযায়ী পাথ দিন
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch purchase order");
      }

      const foundOrder = data.data || data;
      setOrderData(foundOrder);

      // আইটেমগুলো ম্যাপ করা
      if (foundOrder.purchasedItems && foundOrder.purchasedItems.length > 0) {
        const mappedItems = foundOrder.purchasedItems.map((item) => {
          const itemId = item.productId?._id || item.productId || item._id;
          const matchedProd = products.find(
            (p) => String(p._id || p.id) === String(itemId)
          );

          return {
            productId: itemId || "",
            productName: item.productName || matchedProd?.productName || matchedProd?.name || "",
            orderQty: item.orderQty ?? 1,
            unitPrice: item.unitPrice || matchedProd?.purchasePrice || 0,
          };
        });
        setItems(mappedItems);
      }
    } catch (err) {
      console.error("Error loading order data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId, products]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return {
    orderData,
    items,
    loading,
    error,
    handleItemChange,
    handleRemoveItem,
    refetchOrder: fetchOrderData,
  };
};