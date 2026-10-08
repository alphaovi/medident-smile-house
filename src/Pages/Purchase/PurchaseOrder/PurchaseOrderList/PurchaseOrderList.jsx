// PurchaseOrderList.jsx
import { useState } from "react";
import { FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseOrderTable from "./PurchaseOrderTable";
import EditPurchaseOrderModal from "./EditPurchaseOrderModal";
import { purchaseOrderService } from "../../../../services/purchaseOrderService/purchaseOrderService";

const PurchaseOrderList = ({ orders, setOrders, loading, products, productsGroupSubgroup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // কাস্টম আইডি বা purchaseId খুঁজে বের করার ফাংশন
  const getOrderId = (ord) => ord?.purchaseId || ord?.orderID || ord?.orderNo || ord?.id || ord?._id;

  const handleStatusChangeDirect = async (orderKey, newStatus) => {
    try {
      const targetOrder = orders.find((ord) => getOrderId(ord) === orderKey || ord._id === orderKey);
      if (!targetOrder) return;

      const updatedPayload = {
        ...targetOrder,
        status: newStatus,
      };

      // ব্যাকএন্ড যেহেতু purchaseId দিয়ে খুঁজে, তাই এখানে _id এর বদলে getOrderId ব্যবহার করা হলো
      const orderId = getOrderId(targetOrder) || orderKey;
      await purchaseOrderService.updateOrder(orderId, updatedPayload);

      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          const currentId = getOrderId(ord);
          return (currentId === orderKey || ord._id === orderKey) ? { ...ord, status: newStatus } : ord;
        })
      );
      toast.success(`Order status updated to "${newStatus}"!`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status on server.");
    }
  };

  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveOrder = async (updatedData) => {
    try {
      // এখানেও _id এর পরিবর্তে কাস্টম purchaseId কে প্রাধান্য দেওয়া হলো
      const orderId = getOrderId(updatedData) || updatedData._id;
      
      const resolvedTotalAmount = 
        updatedData.totalAmount ?? 
        updatedData.grandTotal ?? 
        updatedData.total ?? 
        updatedData.totals?.grandTotal ?? 0;

      const resolvedStatus = updatedData.status || "Ordered";

      if (orderId && orders.some(ord => getOrderId(ord) === orderId || ord._id === orderId)) {
        // Update existing order via API
        const updatedResponse = await purchaseOrderService.updateOrder(orderId, updatedData);
        const savedOrder = updatedResponse || updatedData;

        setOrders((prevOrders) =>
          prevOrders.map((ord) =>
            (ord._id === orderId || getOrderId(ord) === orderId)
              ? { ...ord, ...savedOrder, totalAmount: resolvedTotalAmount, status: resolvedStatus }
              : ord
          )
        );
        toast.success("Purchase order updated successfully!");
      } else {
        // Create new order via API
        const newOrderPayload = {
          purchaseId: `PO-${Date.now().toString().slice(-6)}`,
          grandTotal: resolvedTotalAmount,
          baseSubtotal: updatedData.totals?.rawSubtotal || 0,
          status: resolvedStatus,
          ...updatedData
        };
        
        const createdOrder = await purchaseOrderService.createOrder(newOrderPayload);
        setOrders((prevOrders) => [createdOrder || newOrderPayload, ...prevOrders]);
        toast.success("Purchase order created successfully!");
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      toast.error("Failed to save purchase order to database.");
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const oId = getOrderId(order) || "";
    const sName = order.supplierName?.name || order.supplierName || order.supplier || "";
    return (
      oId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="size-5 text-teal-600" />
            Purchase Order History
          </h2>
          <p className="text-sm text-base-content/70 mt-0.5">
            View, update status, edit, and print your batch purchase orders.
          </p>
        </div>
      </div>

      <PurchaseOrderTable
        orders={filteredOrders}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onStatusChange={handleStatusChangeDirect}
        onEditOrder={handleOpenEditModal}
      />

      <EditPurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        products={products}
        productsGroupSubgroup={productsGroupSubgroup}
        onSaveStoreProduct={handleSaveOrder}
        editData={editingOrder}
      />
    </div>
  );
};

export default PurchaseOrderList;