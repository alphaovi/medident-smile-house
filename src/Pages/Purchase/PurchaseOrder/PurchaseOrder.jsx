// PurchaseOrder.jsx
import { useState, useEffect } from "react";
import { PlusCircle, ShoppingBag } from "lucide-react";
import PurchaseOrderModal from "./PurchaseOrderModal/PurchaseOrderModal";
import { toast } from "react-toastify";
import PurchaseOrderList from "./PurchaseOrderList/PurchaseOrderList";
import { purchaseOrderService } from "../../../services/purchaseOrderService/purchaseOrderService";

const API_URL = import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1";

const PurchaseOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, resProducts, resGroups] = await Promise.all([
          purchaseOrderService.getAllOrders().catch(() => []),
          fetch(`${API_URL}/products`).catch(() => ({ ok: false })),
          fetch(`${API_URL}/product-groups`).catch(() => ({ ok: false }))
        ]);

        const prodJson = resProducts.ok ? await resProducts.json() : [];
        const productsData = Array.isArray(prodJson) ? prodJson : (prodJson.data || prodJson.result || []);

        const groupJson = resGroups.ok ? await resGroups.json() : [];
        const groupsData = Array.isArray(groupJson) ? groupJson : (groupJson.data || groupJson.result || []);

        let rawOrders = ordersData;
        if (ordersData && !Array.isArray(ordersData)) {
          rawOrders = ordersData.data || ordersData.result || [];
        }

        const normalizedOrders = (Array.isArray(rawOrders) ? rawOrders : []).map((ord) => {
          const sup = ord.supplierName;
          let resolvedSupName = "Default Supplier";
          let rawSupRef = sup;

          if (typeof sup === "object" && sup !== null) {
            resolvedSupName = sup.supplierName || sup.name || "Default Supplier";
            rawSupRef = sup._id || sup.supplierId || sup;
          } else {
            resolvedSupName = sup;
            rawSupRef = sup;
          }

          return {
            ...ord,
            orderID: ord.purchaseId || ord.orderID || ord._id,
            orderDate: ord.purchaseDate ? ord.purchaseDate.split("T")[0] : (ord.orderDate || "N/A"),
            expectedReceiveDate: ord.expectedDeliveryDate ? ord.expectedDeliveryDate.split("T")[0] : (ord.expectedReceiveDate || ord.expectedDate || "N/A"),
            totalAmount: ord.grandTotal ?? ord.totalAmount ?? ord.total ?? 0,
            supplierName: resolvedSupName,
            supplierRef: rawSupRef,
            purchasedItems: ord.items || ord.purchasedItems || []
          };
        });

        setPurchaseHistory(normalizedOrders);
        setProducts(productsData);
        setProductsGroupSubgroup(groupsData);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load initial data from server.");
        setPurchaseHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveStoreProduct = async (purchaseBatchData) => {
    try {
      if (purchaseBatchData.orderID || purchaseBatchData._id) {
        const id = purchaseBatchData._id || purchaseBatchData.orderID;
        const updated = await purchaseOrderService.updateOrder(id, purchaseBatchData);
        
        const sup = (updated || purchaseBatchData).supplierName;
        const resolvedSupName = typeof sup === "object" && sup !== null ? (sup.supplierName || sup.name || "Default Supplier") : (sup || "Default Supplier");

        const normalizedUpdated = {
          ...(updated || purchaseBatchData),
          orderID: (updated || purchaseBatchData).purchaseId || (updated || purchaseBatchData).orderID || id,
          orderDate: (updated || purchaseBatchData).purchaseDate ? (updated || purchaseBatchData).purchaseDate.split("T")[0] : new Date().toISOString().split("T")[0],
          totalAmount: (updated || purchaseBatchData).grandTotal ?? (updated || purchaseBatchData).totalAmount ?? 0,
          supplierName: resolvedSupName,
        };

        setPurchaseHistory((prev) =>
          prev.map((ord) => ((ord._id === id || ord.orderID === id) ? { ...ord, ...normalizedUpdated } : ord))
        );
        toast.success("Purchase order updated successfully!");
      } else {
        const newOrderPayload = {
          purchaseId: `PO-${Date.now().toString().slice(-6)}`,
          grandTotal: purchaseBatchData.grandTotal || purchaseBatchData.totals?.grandTotal || 0,
          baseSubtotal: purchaseBatchData.baseSubtotal || purchaseBatchData.totals?.rawSubtotal || 0,
          status: "Ordered",
          ...purchaseBatchData
        };
        
        const savedOrder = await purchaseOrderService.createOrder(newOrderPayload);
        const actualSaved = savedOrder?.data || savedOrder || newOrderPayload;

        const sup = actualSaved.supplierName;
        const resolvedSupName = typeof sup === "object" && sup !== null ? (sup.supplierName || sup.name || "Default Supplier") : (sup || "Default Supplier");

        const formattedNewOrder = {
          ...actualSaved,
          orderID: actualSaved.purchaseId || "PO-NEW",
          orderDate: actualSaved.purchaseDate ? actualSaved.purchaseDate.split("T")[0] : new Date().toISOString().split("T")[0],
          expectedReceiveDate: actualSaved.expectedDeliveryDate ? actualSaved.expectedDeliveryDate.split("T")[0] : "N/A",
          totalAmount: actualSaved.grandTotal ?? 0,
          supplierName: resolvedSupName,
          purchasedItems: actualSaved.items || []
        };

        setPurchaseHistory((prev) => [formattedNewOrder, ...prev]);
        toast.success("Purchase order created successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save purchase order to database.");
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
