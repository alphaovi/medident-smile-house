// src/Pages/Sales/SaleReturn/SingleSellReturn.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { Edit, History, Box } from "lucide-react";

const SingleSellReturn = ({ returnOrder, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const returnDate = returnOrder.returnDate ? new Date(returnOrder.returnDate).toLocaleDateString() : "N/A";
  const firstProductName = returnOrder.products?.[0]?.productName || "N/A";
  const totalProductsCount = returnOrder.products?.length || 0;

  const grandTotal = Number(returnOrder.grandTotal) || 0;
  const paidAmount = Number(returnOrder.paidAmount) || 0;
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  const isCompleted = dueAmount <= 0;
  const currentStatus = isCompleted ? "completed" : "Due";

  // 🟢 সাবটোটাল এবং জেনারেল ডিসকাউন্ট হিসাব
  const itemsSubtotal = Array.isArray(returnOrder.products)
    ? returnOrder.products.reduce((acc, item) => acc + (Number(item.afterDiscount || item.totalPrice) || 0), 0)
    : grandTotal;

  const genDiscVal = Number(returnOrder.generalDiscountValue) || 0;
  const genDiscType = returnOrder.generalDiscountType || "percentage";
  
  let generalDiscountAmount = 0;
  if (genDiscVal > 0) {
    if (genDiscType === "percentage" || genDiscType === "percent" || genDiscType === "%") {
      generalDiscountAmount = (itemsSubtotal * genDiscVal) / 100;
    } else {
      generalDiscountAmount = genDiscVal;
    }
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-3 text-gray-600 text-xs">{returnDate}</td>
        <td className="p-3 font-semibold text-orange-600">{returnOrder.returnNo}</td>
        <td className="p-3">
          <div className="font-medium text-gray-900">{returnOrder.customerName}</div>
          <div className="text-xs text-gray-500">
            {returnOrder.customerOffice}, {returnOrder.customerState}
          </div>
        </td>
        <td className="p-3 text-gray-700 font-medium">
          {firstProductName}
          {totalProductsCount > 1 && (
            <span className="text-xs text-orange-500 ml-1">
              (+{totalProductsCount - 1} more)
            </span>
          )}
        </td>
        <td className="p-3 text-right text-rose-600 font-medium">
          {dueAmount > 0 ? `৳${dueAmount}` : <span className="text-emerald-600 font-semibold">due nai</span>}
        </td>
        <td className="p-3 text-right text-gray-800 font-semibold">
          ৳{grandTotal}
        </td>
        <td className="p-3 text-center">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-rose-100 text-rose-700 border-rose-300"
            }`}
          >
            {currentStatus}
          </span>
        </td>
        <td className="p-3 text-center flex items-center justify-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-xs transition shadow-xs cursor-pointer"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(returnOrder)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold rounded-lg text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Edit className="size-3.5" /> Edit
          </button>
        </td>
      </tr>

      {/* Modal / Details view */}
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
                Sell Return Details:{" "}
                <span className="text-orange-600">
                  {returnOrder.returnNo}
                </span>
              </h2>

              {/* Customer & Region Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-gray-500 block">
                    State / Region
                  </span>
                  <span className="font-medium text-gray-800">
                    {returnOrder.customerState || returnOrder.stateOrRegion || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Customer Name
                  </span>
                  <span className="font-medium text-gray-800">
                    {returnOrder.customerName}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Return Date
                  </span>
                  <span className="font-medium text-gray-800">
                    {returnDate}
                  </span>
                </div>
              </div>

              {/* Returned Products Table */}
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5">
                  <Box className="size-4 text-orange-600" /> Returned Products & Detailed Discounts
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 uppercase">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5 text-center">Returned Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Discount</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {returnOrder.products?.map((item, idx) => {
                        const unitPrice = item.unitPrice || 0;
                        const quantity = item.quantity || item.orderQuantity || 0;
                        const discVal = Number(item.discountValue) || 0;
                        const discAmount = Number(item.discountAmount) || 0;
                        const itemTotal = item.afterDiscount || item.totalPrice || 0;

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
                              ৳{itemTotal}
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
                  {(!returnOrder.payments || returnOrder.payments.length === 0) ? (
                    <div className="text-gray-400 text-center py-2">
                      No payment history recorded.
                    </div>
                  ) : (
                    returnOrder.payments.map((pay, i) => (
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

              {/* CALCULATION SUMMARY (Including General Discount) */}
              <div className="flex justify-end">
                <div className="w-full md:w-80 bg-gray-50 border rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Items Subtotal:</span>
                    <span>৳{itemsSubtotal}</span>
                  </div>
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
                  <div className="flex justify-between font-bold text-sm pt-1">
                    <span>Grand Total:</span>
                    <span className="text-gray-800">
                      ৳{grandTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Paid Amount:</span>
                    <span>৳{paidAmount}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium border-t pt-1">
                    <span>Due Amount:</span>
                    <span>
                      {dueAmount > 0 ? `৳${dueAmount}` : <span className="text-emerald-600 font-semibold">due nai</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="bg-gray-50 px-2 py-3 border-t border-gray-100 flex justify-end items-center">
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

export default SingleSellReturn;