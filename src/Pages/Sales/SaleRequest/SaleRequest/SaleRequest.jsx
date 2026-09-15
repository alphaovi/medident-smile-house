import { useState, useEffect } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2"; // <-- SweetAlert2 ইম্পোর্ট করুন
import CreateSale from "../../CreateSale/CreateSale"; 

const SaleRequest = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // এডিট মোড এবং মোডাল কন্ট্রোল স্টেট
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState(null);

  useEffect(() => {
    fetch("/pendingOrders.json")
      .then((res) => res.json())
      .then((data) => {
        const initializedData = data.map((order) => ({
          ...order,
          status: "Pending",
          isMovedToTrash: false,
        }));
        setOrders(initializedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load pending orders:", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === id && order.status !== newStatus) {
          const toastId = `status-${order._id}`;
          
          if (!toast.isActive(toastId)) {
            if (newStatus === "Approved") {
              toast.success(`Order ${order.orderNo} approved successfully! Moved to approved list.`, {
                toastId: toastId,
              });
            } else {
              toast.info(`Order ${order.orderNo} status updated to ${newStatus}.`, {
                toastId: toastId,
              });
            }
          }

          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  // SweetAlert2 দিয়ে ডিলিট কনফার্মেশন এবং টোস্ট হ্যান্ডলিং
  const handleDeleteOrder = (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to move order ${order.orderNo} to trash?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders((prevOrders) =>
          prevOrders.map((ord) => {
            if (ord.orderNo === order.orderNo && !ord.isMovedToTrash) {
              return { ...ord, isMovedToTrash: true };
            }
            return ord;
          })
        );

        const toastId = `delete-${order.orderNo}`;
        if (!toast.isActive(toastId)) {
          toast.warn(`Order ${order.orderNo} moved to trash.`, {
            toastId: toastId,
            autoClose: 2000,
          });
        }
      }
    });
  };

  // এডিট বাটনে ক্লিক করলে একই orderNo এর সব আইটেম একসাথে গ্রুপ করে পাঠানো হচ্ছে
  const handleOpenEditModal = (currentOrder) => {
    const relatedItems = orders.filter(
      (ord) => ord.orderNo === currentOrder.orderNo && !ord.isMovedToTrash
    );

    const consolidatedEditData = {
      orderNo: currentOrder.orderNo,
      orderDate: currentOrder.orderDate,
      customerName: currentOrder.customerName,
      customerOffice: currentOrder.customerOffice,
      customerState: currentOrder.customerState,
      soldItems: relatedItems.map((item) => ({
        productId: item.productId,
        selectedGroup: item.productGroup,
        selectedSubGroup: item.productSubGroup,
        productName: item.productName,
        unitPrice: item.unitPrice,
        orderQty: item.orderQuantity,
        discount: item.discount,
        total: item.total,
      })),
    };

    setSelectedOrderToEdit(consolidatedEditData);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = (updatedSaleData) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => 
        ord.orderNo === updatedSaleData.orderNo ? { ...ord, ...updatedSaleData } : ord
      )
    );
    setIsEditModalOpen(false);
    setSelectedOrderToEdit(null);
    toast.success("Order updated successfully!");
  };

  const activeOrders = orders.filter(
    (order) => !order.isMovedToTrash && order.status !== "Approved"
  );

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium animate-pulse">Loading sell requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={2000} limit={1} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sell Requests</h1>
          <p className="text-sm text-gray-500">Manage and review incoming customer sell orders.</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
              <th className="p-3">Order No</th>
              <th className="p-3">Client Info</th>
              <th className="p-3">Product Name</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3 text-right">After Discount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {activeOrders.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-12 text-center text-gray-500">
                  No pending sell requests available.
                </td>
              </tr>
            ) : (
              activeOrders.map((order) => {
                const afterDiscount = order.total - order.discount;
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-semibold text-blue-600">{order.orderNo}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerOffice}, {order.customerState}</div>
                    </td>
                    <td className="p-3 text-gray-800">{order.productName}</td>
                    <td className="p-3 text-center text-gray-700">{order.orderQuantity}</td>
                    <td className="p-3 text-right text-gray-700">৳{order.unitPrice}</td>
                    <td className="p-3 text-right text-gray-700">৳{order.price}</td>
                    <td className="p-3 text-right text-rose-600">৳{order.discount}</td>
                    <td className="p-3 text-right font-medium text-emerald-600">৳{afterDiscount}</td>
                    <td className="p-3 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* এডিট মোডাল */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
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