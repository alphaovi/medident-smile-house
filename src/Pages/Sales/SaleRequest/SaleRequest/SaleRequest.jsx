// src/components/sale/SaleRequest.jsx
import { useState } from "react";
import { Eye, Edit, Trash2, X, History } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateSale from "../../CreateSale/CreateSale";
import { useSaleOrderServices } from "../../../../services/saleOrderService/useSaleOrderServices";

const SaleRequest = () => {
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState(null);
  const [selectedOrderToView, setSelectedOrderToView] = useState(null);

  // TanStack React Query diye data instant load and caching
  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ["saleOrders"],
    queryFn: async () => {
      const res = await useSaleOrderServices.getAllSaleOrders();
      const orderList = Array.isArray(res) ? res : (res?.data || res?.result || []);
      
      return orderList.map((order) => ({
        ...order,
        status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending",
      }));
    },
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await useSaleOrderServices.updateOrderStatus(orderId, newStatus);
      queryClient.invalidateQueries(["saleOrders"]); // Instant refetch
      toast.success(`Order status updated to ${newStatus}!`);
    } catch (error) {
      toast.error("Failed to update status on server.");
    }
  };

  const handleDeleteOrder = (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this order?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await useSaleOrderServices.deleteSaleOrder(order._id);
          queryClient.invalidateQueries(["saleOrders"]); // Instant refetch
          toast.warn(`Order deleted successfully.`, { autoClose: 2000 });
        } catch (error) {
          toast.error("Failed to delete order from server.");
        }
      }
    });
  };

  // --- View Modal Mapping Fix (Payments history soho) ---
  const handleOpenViewModal = (currentOrder) => {
    const formattedViewData = {
      orderNo: currentOrder._id,
      orderDate: currentOrder.orderDate ? new Date(currentOrder.orderDate).toLocaleDateString() : "N/A",
      customerState: currentOrder.stateOrRegion || "",
      customerName: currentOrder.customer?.name || currentOrder.customer?.customerName || "N/A",
      customerOffice: currentOrder.customer?.address || currentOrder.customer?.office || "",
      subtotal: currentOrder.grandTotal || 0,
      paidAmount: currentOrder.paidAmount || 0,
      dueAmount: currentOrder.dueAmount || 0,
      payments: currentOrder.payments || currentOrder.paymentHistory || [], // Payment history array
      soldItems: Array.isArray(currentOrder.products) ? currentOrder.products.map((item) => ({
        selectedGroup: item.group?.groupName || item.group?.name || "",
        selectedSubGroup: item.subGroup?.subGroupName || item.subGroup?.name || "",
        productName: item.product?.name || item.product?.productName || "Product",
        unitPrice: item.price || 0,
        orderQty: item.quantity || 0,
        discount: item.discount || 0,
        total: item.afterDiscount || item.totalPrice || 0,
      })) : [],
    };
    setSelectedOrderToView(formattedViewData);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (currentOrder) => {
    setSelectedOrderToEdit({
      orderNo: currentOrder._id,
      orderDate: currentOrder.orderDate,
      customerState: currentOrder.stateOrRegion || "",
      customerName: currentOrder.customer?.name || currentOrder.customer?.customerName || "",
      customerOffice: currentOrder.customer?.address || "",
      subtotal: currentOrder.grandTotal || 0,
      paidAmount: currentOrder.paidAmount || 0,
      dueAmount: currentOrder.dueAmount || 0,
      generalDiscountType: currentOrder.generalDiscountType || "%",
      generalDiscountValue: currentOrder.generalDiscountValue || 0,
      payments: currentOrder.payments || currentOrder.paymentHistory || [],
      soldItems: Array.isArray(currentOrder.products) ? currentOrder.products.map((item) => ({
        productId: item.product?._id || item.product,
        selectedGroup: item.group?._id || item.group,
        selectedSubGroup: item.subGroup?._id || item.subGroup,
        productName: item.product?.name || "",
        unitPrice: item.price || 0,
        orderQty: item.quantity || 0,
        discount: item.discount || 0,
        total: item.totalPrice || 0,
      })) : [],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedOrderToEdit(null);
    queryClient.invalidateQueries(["saleOrders"]); // Instant refetch
    toast.success("Sell order updated successfully!");
  };

  const activeOrders = orders.filter(
    (order) => order.status?.toLowerCase() !== "delivered"
  );

  if (loading) {
    return <div className="p-6 text-center">Loading sell requests...</div>;
  }

  return (
    <div className="p-6 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={2000} limit={1} />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Sell Requests</h1>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 border-b text-xs uppercase">
              <th className="p-3">Order Date</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Client Info</th>
              <th className="p-3 text-right">Total Amount</th>
              <th className="p-3 text-right">Paid</th>
              <th className="p-3 text-right">Due</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {activeOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">No pending orders.</td>
              </tr>
            ) : (
              activeOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-blue-600">{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-3">
                    <div className="font-medium">{order.customer?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{order.stateOrRegion}</div>
                  </td>
                  <td className="p-3 text-right font-medium">৳{order.grandTotal}</td>
                  <td className="p-3 text-right text-emerald-600">৳{order.paidAmount}</td>
                  <td className="p-3 text-right text-rose-600">৳{order.dueAmount}</td>
                  <td className="p-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-2 py-1 rounded text-xs border bg-amber-50 text-amber-700 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button onClick={() => handleOpenViewModal(order)} className="p-1 hover:bg-gray-100 text-gray-600 rounded cursor-pointer"><Eye className="size-4" /></button>
                    <button onClick={() => handleOpenEditModal(order)} className="p-1 hover:bg-gray-100 text-blue-600 rounded cursor-pointer"><Edit className="size-4" /></button>
                    <button onClick={() => handleDeleteOrder(order)} className="p-1 hover:bg-gray-100 text-rose-600 rounded cursor-pointer"><Trash2 className="size-4" /></button>
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
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800">
              View Sale Order: <span className="text-blue-600">{selectedOrderToView.orderNo}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border rounded-xl text-xs">
              <div>
                <span className="font-semibold text-gray-500 block">State / Region</span>
                <span className="font-medium text-gray-800">{selectedOrderToView.customerState || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">Customer Name</span>
                <span className="font-medium text-gray-800">{selectedOrderToView.customerName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">Order Date</span>
                <span className="font-medium text-gray-800">{selectedOrderToView.orderDate}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Products Ordered</h3>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 uppercase">
                    <tr>
                      <th className="p-2.5">Product</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrderToView.soldItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{item.productName}</td>
                        <td className="p-2.5 text-center">{item.orderQty}</td>
                        <td className="p-2.5 text-right">৳{item.unitPrice}</td>
                        <td className="p-2.5 text-right font-semibold text-emerald-600">৳{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAYMENT HISTORY SECTION INSIDE VIEW MODAL */}
            <div className="bg-gray-50 border rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-700 flex items-center gap-1.5 mb-2">
                <History className="size-4 text-teal-600" /> Payment History
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
                {selectedOrderToView.payments.length === 0 ? (
                  <div className="text-gray-400 text-center py-2">No payment history recorded.</div>
                ) : (
                  selectedOrderToView.payments.map((pay, i) => (
                    <div key={i} className="flex justify-between items-center text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                      <span className="font-medium">{pay.date ? new Date(pay.date).toLocaleDateString() : "N/A"}</span>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">৳{pay.amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-72 bg-gray-50 border rounded-xl p-3 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">৳{selectedOrderToView.subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Paid:</span>
                  <span>৳{selectedOrderToView.paidAmount}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Due:</span>
                  <span>৳{selectedOrderToView.dueAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-4">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"><X className="size-5" /></button>
            <CreateSale editData={selectedOrderToEdit} onUpdateSuccess={handleUpdateSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleRequest;