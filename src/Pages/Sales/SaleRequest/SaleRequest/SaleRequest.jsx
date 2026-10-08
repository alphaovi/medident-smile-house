import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import CreateSale from "../../CreateSale/CreateSale";
import { useSaleOrderServices } from "../../../../services/saleOrderService/useSaleOrderServices"; // Updated import

const SaleRequest = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState(null);
  const [selectedOrderToView, setSelectedOrderToView] = useState(null);

  // Fetch orders from backend API on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await useSaleOrderServices.getAllSaleOrders();
      const orderList = Array.isArray(res) ? res : (res?.data || res?.result || []);
      
      const initializedData = orderList.map((order) => ({
        ...order,
        status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending",
        isMovedToTrash: false,
      }));
      setOrders(initializedData);
    } catch (err) {
      console.error("Failed to load sale orders:", err);
      toast.error("Failed to load sale orders from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Call backend API to update status via PATCH using useSaleOrderServices
      await useSaleOrderServices.updateOrderStatus(orderId, newStatus);

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId && order.status !== newStatus) {
            const toastId = `status-${orderId}`;

            if (!toast.isActive(toastId)) {
              if (newStatus === "Approved") {
                toast.success(`Order status updated to approved successfully!`, { toastId });
              } else if (newStatus === "Delivered") {
                toast.success(`Order marked as delivered!`, { toastId });
              } else {
                toast.info(`Order status updated to ${newStatus}.`, { toastId });
              }
            }
            return { ...order, status: newStatus };
          }
          return order;
        })
      );
    } catch (error) {
      toast.error("Failed to update status on server.");
    }
  };

  // Delete Confirmation
  const handleDeleteOrder = (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to move this order to trash?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await useSaleOrderServices.deleteSaleOrder(order._id);
          setOrders((prevOrders) =>
            prevOrders.map((ord) =>
              ord._id === order._id ? { ...ord, isMovedToTrash: true } : ord
            )
          );
          toast.warn(`Order moved to trash.`, { autoClose: 2000 });
        } catch (error) {
          toast.error("Failed to delete order from server.");
        }
      }
    });
  };

  // View Modal Data Mapping (Mapping backend schema fields to frontend expectations)
  const handleOpenViewModal = (currentOrder) => {
    const formattedViewData = {
      orderNo: currentOrder._id,
      orderDate: currentOrder.orderDate ? new Date(currentOrder.orderDate).toLocaleDateString() : "N/A",
      customerState: currentOrder.stateOrRegion || "",
      customerName: currentOrder.customer?.name || "N/A",
      customerOffice: currentOrder.customer?.address || "",
      subtotal: currentOrder.grandTotal || 0,
      paidAmount: currentOrder.paidAmount || 0,
      dueAmount: currentOrder.dueAmount || 0,
      generalDiscountType: currentOrder.generalDiscountType || "%",
      generalDiscountValue: currentOrder.generalDiscountValue || 0,
      soldItems: currentOrder.products.map((item) => ({
        productId: item.product?._id || "",
        selectedGroup: item.group?.groupName || "",
        selectedSubGroup: item.subGroup?.subGroupName || "",
        productName: item.product?.name || "Unknown Product",
        unitPrice: item.price || 0,
        orderQty: item.quantity || 0,
        discount: item.discount || 0,
        total: item.totalPrice || 0,
      })),
    };
    setSelectedOrderToView(formattedViewData);
    setIsViewModalOpen(true);
  };

  // Edit Modal Data Mapping
  const handleOpenEditModal = (currentOrder) => {
    const consolidatedEditData = {
      orderNo: currentOrder._id,
      orderDate: currentOrder.orderDate,
      customerState: currentOrder.stateOrRegion || "",
      customerName: currentOrder.customer?.name || "",
      customerOffice: currentOrder.customer?.address || "",
      subtotal: currentOrder.grandTotal || 0,
      paidAmount: currentOrder.paidAmount || 0,
      dueAmount: currentOrder.dueAmount || 0,
      generalDiscountType: currentOrder.generalDiscountType || "%",
      generalDiscountValue: currentOrder.generalDiscountValue || 0,
      soldItems: currentOrder.products.map((item) => ({
        productId: item.product?._id || "",
        selectedGroup: item.group?._id || "",
        selectedSubGroup: item.subGroup?._id || "",
        productName: item.product?.name || "",
        unitPrice: item.price || 0,
        orderQty: item.quantity || 0,
        discount: item.discount || 0,
        total: item.totalPrice || 0,
      })),
    };

    setSelectedOrderToEdit(consolidatedEditData);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = (updatedSaleData) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) =>
        ord._id === updatedSaleData._id
          ? { ...ord, ...updatedSaleData }
          : ord
      )
    );
    setIsEditModalOpen(false);
    setSelectedOrderToEdit(null);
    toast.success("Order updated successfully!");
    fetchOrders(); // Refresh list
  };

  // Active orders filter: Show items that are not in trash and not Delivered
  const activeOrders = orders.filter(
    (order) =>
      !order.isMovedToTrash &&
      order.status?.toLowerCase() !== "delivered"
  );

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium animate-pulse">
          Loading sell requests...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={2000} limit={1} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sell Requests</h1>
          <p className="text-sm text-gray-500">
            Manage and review incoming customer sell orders from database.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
              <th className="p-3">Order Date</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Client Info</th>
              <th className="p-3 text-right">Total Amount</th>
              <th className="p-3 text-right">Paid Amount</th>
              <th className="p-3 text-right">Due Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {activeOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-12 text-center text-gray-500">
                  No pending sell requests available.
                </td>
              </tr>
            ) : (
              activeOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-gray-600">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 font-semibold text-blue-600">
                    {order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-gray-900">
                      {order.customer?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customer?.address}, {order.stateOrRegion}
                    </div>
                  </td>
                  <td className="p-3 text-right font-medium text-gray-800">
                    ৳{order.grandTotal}
                  </td>
                  <td className="p-3 text-right font-medium text-emerald-600">
                    ৳{order.paidAmount}
                  </td>
                  <td className="p-3 text-right font-medium text-rose-600">
                    ৳{order.dueAmount}
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenViewModal(order)}
                        title="View Order"
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(order)}
                        title="Edit Order"
                        className="p-1.5 hover:bg-gray-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order)}
                        title="Move to Trash"
                        className="p-1.5 hover:bg-gray-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedOrderToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🛒 View Sale Order: <span className="text-blue-600">{selectedOrderToView.orderNo}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">State / Division</label>
                <div className="mt-1 font-medium text-gray-800">{selectedOrderToView.customerState || "N/A"}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Customer Name</label>
                <div className="mt-1 font-medium text-gray-800">{selectedOrderToView.customerName || "N/A"}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Order Date</label>
                <div className="mt-1 font-medium text-gray-800">{selectedOrderToView.orderDate}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Product Selection & Pricing</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="p-3">Group</th>
                      <th className="p-3">Sub-Group</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Unit Price (৳)</th>
                      <th className="p-3 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrderToView.soldItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-700">{item.selectedGroup || "-"}</td>
                        <td className="p-3 text-gray-700">{item.selectedSubGroup || "-"}</td>
                        <td className="p-3 font-medium text-gray-900">{item.productName}</td>
                        <td className="p-3 text-center">{item.orderQty}</td>
                        <td className="p-3 text-right">৳{item.unitPrice}</td>
                        <td className="p-3 text-right font-semibold text-emerald-600">৳{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-96 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">৳{selectedOrderToView.subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Paid Amount:</span>
                  <span>৳{selectedOrderToView.paidAmount}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Due Amount:</span>
                  <span>৳{selectedOrderToView.dueAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10 cursor-pointer"
            >
              <X className="size-5" />
            </button>
            <div className="p-2">
              <CreateSale
                key={selectedOrderToEdit?.orderNo || "edit"}
                editData={selectedOrderToEdit}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleRequest;