import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const ApproveSellList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect ব্যবহার করে JSON ফাইল বা API থেকে ডাটা ফেচ করা
  useEffect(() => {
    fetch("/pendingOrders.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch pending orders data.");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading orders:", error);
        toast.error("Failed to load orders data!");
        setLoading(false);
      });
  }, []);

  // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার (SweetAlert কনফার্মেশন সহ)
  const handleStatusChangeWithConfirmation = (id, orderNo, newStatus) => {
    if (newStatus === "Delivered") {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to mark order ${orderNo} as Delivered? Once delivered, it will be removed from this approve list.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, Deliver it!",
      }).then((result) => {
        if (result.isConfirmed) {
          updateOrderStatus(id, newStatus);
          Swal.fire("Delivered!", `Order ${orderNo} has been marked as delivered.`, "success");
        }
      });
    } else if (newStatus === "Pending") {
      Swal.fire({
        title: "Move to Pending?",
        text: `Do you want to send order ${orderNo} back to pending for recheck?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F59E0B",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, Send to Pending!",
      }).then((result) => {
        if (result.isConfirmed) {
          updateOrderStatus(id, newStatus);
          Swal.fire("Moved to Pending!", `Order ${orderNo} is sent back for rechecking.`, "info");
        }
      });
    } else {
      updateOrderStatus(id, newStatus);
    }
  };

  // স্ট্যাটাস এবং টাইমলাইন আপডেট করার ফাংশন
  const updateOrderStatus = (id, newStatus) => {
    const currentTime = new Date().toISOString();

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === id) {
          const toastId = `status-update-${order._id}`;
          if (!toast.isActive(toastId)) {
            toast.success(`Order ${order.orderNo} updated to ${newStatus}`, { toastId });
          }

          return {
            ...order,
            status: newStatus,
            timeline: {
              ...order.timeline,
              deliveredDate: newStatus === "Delivered" ? currentTime : order.timeline.deliveredDate,
              approvedDate: newStatus === "Approved" ? currentTime : order.timeline.approvedDate,
              pendingDate: newStatus === "Pending" ? currentTime : order.timeline.pendingDate,
            },
          };
        }
        return order;
      })
    );
  };

  // শুধুমাত্র যেগুলোর স্ট্যাটাস "Approved" কেবল সেগুলোই এখানে টেবিলে দেখাবে
  const approvedList = orders.filter((order) => !order.isMovedToTrash && order.status === "Approved");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 font-medium text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      <ToastContainer position="top-right" autoClose={2000} limit={1} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sell List (Approved Orders)</h1>
          <p className="text-sm text-gray-500">Manage approved sell orders and update them to delivered or recheck status.</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="table w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
              <th className="p-3">Order No</th>
              <th className="p-3">Client Info</th>
              <th className="p-3">Product Name</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3 text-right">After Discount</th>
              <th className="p-3 text-center">Status Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {approvedList.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-12 text-center text-gray-500 font-medium">
                  No approved sell orders found.
                </td>
              </tr>
            ) : (
              approvedList.map((order) => {
                const afterDiscount = order.total - order.discount;

                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-semibold text-blue-600">{order.orderNo}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">
                        {order.customerOffice}, {order.customerState}
                      </div>
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
                        onChange={(e) =>
                          handleStatusChangeWithConfirmation(order._id, order.orderNo, e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-pointer focus:outline-none"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pending">Pending (For Recheck)</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveSellList;