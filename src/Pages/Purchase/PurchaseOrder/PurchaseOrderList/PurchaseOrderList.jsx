import  { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseOrderTable from "./PurchaseOrderTable";
import EditPurchaseOrderModal from "./EditPurchaseOrderModal";

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetch("/purchaseOrderList.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch purchase orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching purchase order list:", err);
        toast.error("Could not load purchase orders!");
        setLoading(false);
      });
  }, []);

  // সরাসরি ড্রপডাউন থেকে স্ট্যাটাস পরিবর্তন এবং আপডেট একসাথে হ্যান্ডেল করা
  const handleStatusChangeDirect = (orderID, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) =>
        ord.orderID === orderID ? { ...ord, status: newStatus } : ord
      )
    );
    toast.success(`Order ${orderID} status updated to "${newStatus}"!`);
  };

  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveOrder = (updatedData) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) =>
        ord.orderID === updatedData.orderID ? { ...ord, ...updatedData } : ord
      )
    );
    toast.success("Purchase order updated successfully!");
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        onSaveOrder={handleSaveOrder}
        editData={editingOrder}
      />
    </div>
  );
};

export default PurchaseOrderList;