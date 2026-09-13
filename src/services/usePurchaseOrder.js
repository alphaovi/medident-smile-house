import { useState, useEffect } from "react";

export const usePurchaseOrder = (orderId, products = []) => {
  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        // পাবলিক ফোল্ডার থেকে fetch দিয়ে json ফাইল লোড করা হচ্ছে
        const response = await fetch("/purchaseOrderList.json"); // আপনার ফাইলের সঠিক নাম ও পাথ এখানে দিন
        if (!response.ok) {
          throw new Error("Failed to fetch purchase order list");
        }
        const purchaseOrderList = await response.json();

        const foundOrder = purchaseOrderList.find(
          (order) => order.id === orderId || order.orderId === orderId
        );

        if (foundOrder) {
          setOrderData(foundOrder);

          if (foundOrder.purchasedItems && foundOrder.purchasedItems.length > 0) {
            const mappedItems = foundOrder.purchasedItems.map((item) => {
              const itemId = item.productId || item._id;
              const matchedProd = products.find(
                (p) => (p.productId || p._id) === itemId
              );

              return {
                productId: itemId || "",
                productName: item.productName || matchedProd?.productName || "",
                orderQty: item.orderQty ?? 1,
                unitPrice: item.unitPrice || matchedProd?.purchasePrice || 0,
              };
            });
            setItems(mappedItems);
          }
        }
      } catch (error) {
        console.error("Error loading order data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId, products]);

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
    handleItemChange,
    handleRemoveItem,
  };
};