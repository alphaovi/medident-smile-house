// PurchaseOrder.jsx
import { useState } from "react";
import { PlusCircle, ShoppingBag } from "lucide-react";
import PurchaseOrderModal from "./PurchaseOrderModal/PurchaseOrderModal";
import { toast } from "react-toastify";
import PurchaseOrderList from "./PurchaseOrderList/PurchaseOrderList";
import { purchaseOrderService } from "../../../services/purchaseOrderService/purchaseOrderService";
import { useInventoryManagementService } from "../../../services/useInventoryManagementService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1";

const PurchaseOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { updateInventoryPrice } = useInventoryManagementService();

  // 1. Fetch Purchase Orders
  const { data: rawOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: purchaseOrderService.getAllOrders,
  });

  // 2. Fetch Products
  const { data: products = [] } = useQuery({
    queryKey: ["products-list"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/products`);
      const json = res.ok ? await res.json() : [];
      return Array.isArray(json) ? json : (json.data || json.result || []);
    },
  });

  // 3. Fetch Product Groups
  const { data: productsGroupSubgroup = [] } = useQuery({
    queryKey: ["product-groups-list"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/product-groups`);
      const json = res.ok ? await res.json() : [];
      return Array.isArray(json) ? json : (json.data || json.result || []);
    },
  });

  // Normalize orders for UI
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

  // Helper function to update inventory avgBuyingPrice with weighted average
  const syncInventoryBuyingPrices = async (items) => {
    try {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        const productId = item.product?._id || item.product;
        const incomingQty = Number(item.orderQuantity || item.orderQty || 0);
        const incomingUnitCost = Number(item.unitCost || item.unitCostAfterCalc || item.price || 0);
        
        if (productId && !isNaN(incomingUnitCost)) {
          await updateInventoryPrice(productId, { 
            incomingQty, 
            incomingUnitCost 
          });
        }
      }
    } catch (err) {
      console.error("Failed to sync inventory avgBuyingPrice from purchase order:", err);
    }
  };

  // Mutation for Creating Order
  const createMutation = useMutation({
    mutationFn: purchaseOrderService.createOrder,
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      
      if (variables?.items) {
        await syncInventoryBuyingPrices(variables.items);
      }

      toast.success("Purchase order created and inventory prices updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create purchase order.");
    },
  });

  // Mutation for Updating Order
  const updateMutation = useMutation({
    mutationFn: ({ id, orderData }) => purchaseOrderService.updateOrder({ id, orderData }),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventories"] });

      if (variables?.orderData?.items) {
        await syncInventoryBuyingPrices(variables.orderData.items);
      }

      toast.success("Purchase order and inventory prices updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update purchase order.");
    },
  });

  const handleSaveStoreProduct = async (purchaseBatchData) => {
    const id = purchaseBatchData._id || purchaseBatchData.orderID || purchaseBatchData.purchaseId;
    const isExisting = normalizedOrders.some(ord => ord._id === id || ord.purchaseId === id || ord.orderID === id);

    if (isExisting) {
      updateMutation.mutate({
        id: purchaseBatchData.purchaseId || id, 
        orderData: purchaseBatchData 
      });
    } else {
      const newOrderPayload = {
        purchaseId: `PO-${Date.now().toString().slice(-6)}`,
        grandTotal: purchaseBatchData.grandTotal || purchaseBatchData.totals?.grandTotal || 0,
        baseSubtotal: purchaseBatchData.baseSubtotal || purchaseBatchData.totals?.rawSubtotal || 0,
        status: "Ordered",
        ...purchaseBatchData
      };
      createMutation.mutate(newOrderPayload);
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
            Create batch purchase orders and update product inventory stock instantly.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={ordersLoading}
          className="btn text-white bg-teal-600 hover:bg-teal-700 btn-md gap-2 shadow-md border-0 disabled:opacity-50 cursor-pointer"
        >
          <PlusCircle className="size-5" />
          {ordersLoading ? "Loading Data..." : "Create Purchase Order"}
        </button>
      </div>

      <PurchaseOrderList 
        orders={normalizedOrders}
        loading={ordersLoading}
        products={products}
        productsGroupSubgroup={productsGroupSubgroup}
        updateMutation={updateMutation}
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