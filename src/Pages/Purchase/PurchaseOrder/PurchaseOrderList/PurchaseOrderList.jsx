// PurchaseOrderList.jsx
import { useState, useEffect } from "react";
import { FileText, ShoppingBag, CheckCircle2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseOrderTable from "./PurchaseOrderTable";
import EditPurchaseOrderModal from "./EditPurchaseOrderModal";
import { supplierService } from "../../../../services/supplierService/supplierService";

const PurchaseOrderList = ({ orders, loading, products, productsGroupSubgroup, updateMutation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("purchase-order");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await supplierService.getAllSuppliers();
        let supData = res;
        if (res && typeof res.json === "function") {
          supData = await res.json();
        }
        const extractedSuppliers = Array.isArray(supData) ? supData : (supData?.data || supData?.result || []);
        setSuppliers(extractedSuppliers);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  const getOrderId = (ord) => ord?.purchaseId || ord?.orderID || ord?.orderNo || ord?.id || ord?._id;

  const handleStatusChangeDirect = async (orderKey, newStatus) => {
    const targetOrder = orders.find((ord) => getOrderId(ord) === orderKey || ord._id === orderKey);
    if (!targetOrder) return;

    const purchaseIdKey = targetOrder.purchaseId || orderKey;
    
    updateMutation.mutate({
      id: purchaseIdKey,
      orderData: { status: newStatus }
    }, {
      onSuccess: () => {
        toast.success(`Order status updated to "${newStatus}"!`);
      }
    });
  };

  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveOrder = async (updatedData) => {
    const orderId = updatedData.purchaseId || getOrderId(updatedData);
    updateMutation.mutate({
      id: orderId,
      orderData: updatedData
    }, {
      onSuccess: () => {
        toast.success("Purchase order updated successfully!");
      }
    });
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const oId = getOrderId(order) || "";
    const rawSup = order.supplierName || order.supplier;
    const foundSup = suppliers.find(s => String(s._id) === String(rawSup) || String(s.supplierId) === String(rawSup));
    const sName = foundSup?.supplierName || foundSup?.name || (typeof rawSup === "object" ? (rawSup?.supplierName || rawSup?.name || "") : (rawSup || ""));

    const matchesSearch = 
      oId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sName.toLowerCase().includes(searchTerm.toLowerCase());

    const status = (order.status || "Ordered").toLowerCase();
    
    let matchesTab = true;
    if (activeTab === "purchase-order") {
      matchesTab = status === "ordered" || status === "on transit";
    } else if (activeTab === "received") {
      matchesTab = status === "received";
    }

    return matchesSearch && matchesTab;
  }) : [];

  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden p-6">
      <ToastContainer position="top-right" autoClose={2000} limit={1} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="size-5 text-teal-600" />
            Purchase Order History
          </h2>
          <p className="text-sm text-base-content/70 mt-0.5">
            View, update status, edit, and print your batch purchase orders seamlessly.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5 bg-base-200/50 p-3 rounded-xl border border-base-300">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Order ID or Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm w-full pl-4 text-sm focus:outline-none focus:border-teal-600 bg-base-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveTab("purchase-order")}
            className={`btn btn-sm px-4 font-semibold ${
              activeTab === "purchase-order"
                ? "bg-teal-600 text-white hover:bg-teal-700 border-0 shadow-sm"
                : "btn-ghost bg-base-100 border border-base-300 text-base-content/70 hover:bg-base-200"
            }`}
          >
            <ShoppingBag className="size-4 mr-1.5" /> Purchase Order
          </button>

          <button
            onClick={() => setActiveTab("received")}
            className={`btn btn-sm px-4 font-semibold ${
              activeTab === "received"
                ? "bg-teal-600 text-white hover:bg-teal-700 border-0 shadow-sm"
                : "btn-ghost bg-base-100 border border-base-300 text-base-content/70 hover:bg-base-200"
            }`}
          >
            <CheckCircle2 className="size-4 mr-1.5" /> Purchase Received
          </button>
        </div>
      </div>

      <PurchaseOrderTable
        orders={filteredOrders}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onStatusChange={handleStatusChangeDirect}
        onEditOrder={handleOpenEditModal}
        suppliers={suppliers}
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
        suppliers={suppliers}
      />
    </div>
  );
};

export default PurchaseOrderList;