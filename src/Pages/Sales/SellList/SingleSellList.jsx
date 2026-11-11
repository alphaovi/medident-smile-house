// src/components/sale/SingleSellList.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { History } from "lucide-react";

const SingleSellList = ({ order, onSendBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A";
  const uniqueId = order.realId;

  const firstProductName = order.products?.[0]?.productName || "N/A";
  const totalProductsCount = order.products?.length || 0;

  const itemsSubtotal = Array.isArray(order.products)
    ? order.products.reduce((acc, item) => acc + (Number(item.total) || 0), 0)
    : 0;

  let generalDiscountAmount = 0;
  const genDiscVal = Number(order.generalDiscountValue) || 0;
  const genDiscType = order.generalDiscountType || "percentage";

  if (genDiscVal > 0) {
    if (genDiscType === "percentage" || genDiscType === "percent" || genDiscType === "%") {
      generalDiscountAmount = (itemsSubtotal * genDiscVal) / 100;
    } else {
      generalDiscountAmount = genDiscVal;
    }
  }

  const calculatedGrandTotal = Math.max(0, itemsSubtotal - generalDiscountAmount);

  const handleSendBackClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Order No: ${order.orderNo} will be sent back to Pending & stock will be restored!`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Send Back!",
    }).then((result) => {
      if (result.isConfirmed) {
        onSendBack(uniqueId, "pending");
        setIsModalOpen(false);

        Swal.fire(
          "Sent Back!",
          "Order status changed to Pending and stock has been restored.",
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
          ৳{order.subtotal || calculatedGrandTotal}
        </td>
        <td className="p-3 text-right text-emerald-600 font-medium">
          ৳{order.paidAmount || 0}
        </td>
        <td className="p-3 text-right text-rose-600 font-medium">
          ৳{order.dueAmount || 0}
        </td>
        <td className="p-3 text-center">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-700 border-emerald-300">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold text-gray-800">
                View Sale Order:{" "}
                <span className="text-blue-600">
                  {order.orderNo}
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-gray-500 block">
                    State / Region
                  </span>
                  <span className="font-medium text-gray-800">
                    {order.customerState || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Customer Name
                  </span>
                  <span className="font-medium text-gray-800">
                    {order.customerName}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Order Date
                  </span>
                  <span className="font-medium text-gray-800">
                    {orderDate}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">
                  Products Ordered & Detailed Discounts
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 uppercase">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Discount Details</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {order.products?.map((item, idx) => {
                        const unitPrice = item.unitPrice || 0;
                        const quantity = item.orderQuantity || 0;
                        
                        let discVal = item.discountValue !== undefined ? Number(item.discountValue) : 0;
                        let discAmount = item.discountAmount !== undefined ? Number(item.discountAmount) : 0;

                        return (
                          <tr key={idx}>
                            <td className="p-2.5 font-medium">
                              {item.productName}
                            </td>
                            <td className="p-2.5 text-center">{quantity}</td>
                            <td className="p-2.5 text-right">৳{unitPrice}</td>
                            <td className="p-2.5 text-right text-orange-600 font-medium">
                              {discAmount > 0 ? (
                                <span>
                                  {discVal}
                                  {item.discountType === "fixed" ? "৳" : "%"} (-৳{discAmount})
                                </span>
                              ) : (
                                "৳0"
                              )}
                            </td>
                            <td className="p-2.5 text-right font-semibold text-emerald-600">
                              ৳{item.total}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAYMENT HISTORY */}
              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-bold text-xs uppercase tracking-wide text-gray-700 flex items-center gap-1.5 mb-2">
                  <History className="size-4 text-teal-600" /> Payment History
                </h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
                  {(!order.payments || order.payments.length === 0) && (!order.paymentHistory || order.paymentHistory.length === 0) ? (
                    <div className="text-gray-400 text-center py-2">
                      No payment history recorded.
                    </div>
                  ) : (
                    (order.payments || order.paymentHistory).map((pay, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg"
                      >
                        <span className="font-medium">
                          {pay.date
                            ? new Date(pay.date).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          ৳{pay.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CALCULATION SUMMARY */}
              <div className="flex justify-end">
                <div className="w-full md:w-80 bg-gray-50 border rounded-xl p-3 space-y-1.5 text-xs">
                  {genDiscVal > 0 && (
                    <div className="flex justify-between text-teal-700 font-medium border-b border-dashed pb-1">
                      <span>
                        General Discount (
                        {genDiscType === "percentage" || genDiscType === "percent" || genDiscType === "%"
                          ? `${genDiscVal}%`
                          : `৳${genDiscVal}`}
                        ):
                      </span>
                      <span>- ৳{generalDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">
                      ৳{order.subtotal || calculatedGrandTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Paid:</span>
                    <span>৳{order.paidAmount || 0}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Due:</span>
                    <span>৳{order.dueAmount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-2 py-3 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={handleSendBackClick}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                >
                  Send Back to Pending
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