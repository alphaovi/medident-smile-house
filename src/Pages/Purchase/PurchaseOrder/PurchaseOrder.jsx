// PurchaseOrder.jsx
import { useState, useEffect } from "react";
import { PlusCircle, ShoppingBag } from "lucide-react";
import PurchaseOrderModal from "./PurchaseOrderModal/PurchaseOrderModal";
import { toast } from "react-toastify";
import PurchaseOrderList from "./PurchaseOrderList/PurchaseOrderList";

const PurchaseOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOrders, resProducts, resGroups] = await Promise.all([
          fetch("/purchaseOrderList.json").catch(() => ({ ok: false })),
          fetch("/products.json").catch(() => ({ ok: false, json: () => [] })),
          fetch("/productsGroupSubgroup.json").catch(() => ({ ok: false, json: () => [] }))
        ]);

        const ordersData = resOrders.ok ? await resOrders.json() : [];
        const productsData = resProducts.ok ? await resProducts.json() : [];
        const groupsData = resGroups.ok ? await resGroups.json() : [];

        setPurchaseHistory(ordersData);
        setProducts(productsData);
        setProductsGroupSubgroup(groupsData);
      } catch (error) {
        console.error("Error loading JSON data:", error);
        toast.error("Failed to load initial data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveStoreProduct = (purchaseBatchData) => {
    if (purchaseBatchData.orderID) {
      // Editing existing order
      setPurchaseHistory((prev) =>
        prev.map((ord) => (ord.orderID === purchaseBatchData.orderID ? purchaseBatchData : ord))
      );
      toast.success("Purchase order updated successfully!");
    } else {
      // Creating new order with default status "On Transit"
      const newOrder = {
        orderID: `PO-${Date.now().toString().slice(-6)}`,
        totalAmount: purchaseBatchData.totals?.grandTotal || 0,
        status: "On Transit",
        ...purchaseBatchData
      };
      setPurchaseHistory((prev) => [newOrder, ...prev]);
      toast.success("Purchase order created successfully!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="size-7 text-teal-600" />
            Purchase Orders
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Create batch purchase orders and update product inventory stock.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="btn text-white bg-teal-600 hover:bg-teal-700 btn-md gap-2 shadow-md border-0 disabled:opacity-50 cursor-pointer"
        >
          <PlusCircle className="size-5" />
          {isLoading ? "Loading Data..." : "Create Purchase Order"}
        </button>
      </div>

      <PurchaseOrderList 
        orders={purchaseHistory}
        setOrders={setPurchaseHistory}
        loading={isLoading}
        products={products}
        productsGroupSubgroup={productsGroupSubgroup}
      />

      <PurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        productsGroupSubgroup={productsGroupSubgroup}
        onSaveStoreProduct={handleSaveStoreProduct}
      />
    </div>
  );
};

export default PurchaseOrder;