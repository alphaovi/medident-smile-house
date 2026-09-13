// PurchaseOrderList.jsx
import { useState } from "react";
import { FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseOrderTable from "./PurchaseOrderTable";
import EditPurchaseOrderModal from "./EditPurchaseOrderModal";

const PurchaseOrderList = ({ orders, setOrders, loading, products, productsGroupSubgroup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const getOrderId = (ord) => ord?.orderID || ord?.orderNo || ord?._id || ord?.id;

  const handleStatusChangeDirect = (orderKey, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        const currentId = getOrderId(ord);
        return currentId === orderKey ? { ...ord, status: newStatus } : ord;
      })
    );
    toast.success(`Order status updated to "${newStatus}"!`);
  };

  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveOrder = (updatedData) => {
    setOrders((prevOrders) => {
      const updatedId = getOrderId(updatedData);
      const exists = prevOrders.some((ord) => getOrderId(ord) === updatedId);

      const resolvedTotalAmount = 
        updatedData.totalAmount ?? 
        updatedData.grandTotal ?? 
        updatedData.total ?? 
        updatedData.totals?.grandTotal ?? 0;

      const resolvedStatus = updatedData.status || "Ordered";

      if (exists) {
        return prevOrders.map((ord) =>
          getOrderId(ord) === updatedId
            ? {
                ...ord,
                ...updatedData,
                totalAmount: resolvedTotalAmount,
                status: ord.status || resolvedStatus,
              }
            : ord
        );
      } else {
        const newOrder = {
          ...updatedData,
          orderID: updatedId || `PO-${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: resolvedTotalAmount,
          status: resolvedStatus,
        };
        return [newOrder, ...prevOrders];
      }
    });

    toast.success("Purchase order updated successfully!");
  };

  const filteredOrders = orders.filter((order) => {
    const oId = getOrderId(order) || "";
    const sName = order.supplierName || order.supplier || "";
    return (
      oId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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