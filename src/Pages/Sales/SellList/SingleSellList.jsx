import { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

const SingleSellList = ({ order, onSendBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orderDate = order.orderDate || "N/A";
  const totalAmount = order.subtotal || 0;
  const uniqueId = order.orderNo;

  const firstProductName = order.products?.[0]?.productName || "N/A";
  const totalProductsCount = order.products?.length || 0;

  const handleSendBackClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Order No: ${order.orderNo} status will be changed to Pending!`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706", // Amber/Yellow for Send Back
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Send Back!",
    }).then((result) => {
      if (result.isConfirmed) {
        onSendBack(uniqueId); // Status pending করার ফাংশন কল হলো
        setIsModalOpen(false);

        Swal.fire(
          "Sent Back!",
          "Order status has been changed to Pending.",
          "success",
        );
      }
    });
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-3 text-gray-600 text-xs">{orderDate}</td>
        <td className="p-3 font-semibold text-blue-600">{order.orderNo}</td>
        <td className="p-3">
          <div className="font-medium text-gray-900">{order.customerName}</div>
          <div className="text-xs text-gray-500">
            {order.customerOffice}, {order.customerState}
          </div>
        </td>
        <td className="p-3 text-gray-700 font-medium">
          {firstProductName}
          {totalProductsCount > 1 && (
            <span className="text-xs text-blue-500 ml-1">
              (+{totalProductsCount - 1} more)
            </span>
          )}
        </td>
        <td className="p-3 text-right text-gray-800 font-medium">
          ৳{totalAmount}
        </td>
        <td className="p-3 text-right text-emerald-600 font-medium">
          ৳{order.paidAmount || 0}
        </td>
        <td className="p-3 text-right text-rose-600 font-medium">
          ৳{order.dueAmount || 0}
        </td>
        <td className="p-3 text-center">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
            {order.status || "Delivered"}
          </span>
        </td>
        <td className="p-3 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-xs transition shadow-sm cursor-pointer"
          >
            View Details
          </button>
        </td>
      </tr>

      {/* Modal using Portal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Order Information
                  </h2>
                  <span className="text-xs font-semibold text-blue-600">
                    Order No: {order.orderNo}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Customer Name
                    </p>
                    <p className="font-semibold text-gray-800">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Location
                    </p>
                    <p className="font-semibold text-gray-800">
                      {order.customerOffice}, {order.customerState}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Order Date
                    </p>
                    <p className="font-semibold text-gray-800">{orderDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Status</p>
                    <p className="font-semibold text-emerald-600">
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Products Ordered:
                  </p>
                  {order.products?.map((prod, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {prod.productName}
                        </p>
                        <p className="text-gray-500">
                          Qty: {prod.orderQuantity} | Unit Price: ৳
                          {prod.unitPrice}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">৳{prod.total}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 bg-white p-2 rounded-xl border border-gray-100">
                  <div className="flex justify-between py-1.5 border-b border-dashed border-gray-100 px-2">
                    <span className="text-gray-500 font-medium">Subtotal:</span>
                    <span className="font-bold text-gray-800">
                      ৳{totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-dashed border-gray-100 px-2">
                    <span className="text-gray-500 font-medium">
                      Paid Amount:
                    </span>
                    <span className="font-bold text-emerald-600">
                      ৳{order.paidAmount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-gray-500 font-medium">
                      Due Amount:
                    </span>
                    <span className="font-bold text-rose-600">
                      ৳{order.dueAmount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={handleSendBackClick}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                >
                  Send Back
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default SingleSellList;
