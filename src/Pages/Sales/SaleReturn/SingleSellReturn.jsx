import { useState } from "react";
import { createPortal } from "react-dom";
import { X, History, Edit3 } from "lucide-react";

const SingleSellReturn = ({ returnOrder, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const returnDate = returnOrder.returnDate
    ? new Date(returnOrder.returnDate).toLocaleDateString()
    : "N/A";
  const firstProductName = returnOrder.products?.[0]?.productName || "N/A";
  const totalProductsCount = returnOrder.products?.length || 0;

  const paidTotal = Number(returnOrder.paidAmount || 0);
  const dueTotal = Math.max(0, (returnOrder.grandTotal || 0) - paidTotal);

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
            <span className="text-xs text-orange-500 ml-1 font-semibold">
              (+{totalProductsCount - 1} more)
            </span>
          )}
        </td>
        <td className="p-3 text-right text-gray-800 font-bold">
          ৳{returnOrder.grandTotal}
        </td>
        <td className="p-3 text-center">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300">
            Returned
          </span>
        </td>
        <td className="p-3 text-center flex justify-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold rounded-lg text-xs transition shadow-xs cursor-pointer"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(returnOrder)}
            className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded-lg text-xs transition shadow-xs cursor-pointer flex items-center gap-1"
          >
            <Edit3 className="size-3.5" /> Edit
          </button>
        </td>
      </tr>

      {/* View Details Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="size-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-800">
                Sell Return Details:{" "}
                <span className="text-orange-600">{returnOrder.returnNo}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-gray-500 block">State / Region</span>
                  <span className="font-medium text-gray-800">{returnOrder.customerState || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">Customer Name</span>
                  <span className="font-medium text-gray-800">{returnOrder.customerName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">Return Date</span>
                  <span className="font-medium text-gray-800">{returnDate}</span>
                </div>
              </div>

              {/* Returned Products */}
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">
                  Returned Products & Detailed Discounts
                </h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 uppercase text-gray-600">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5 text-center">Returned Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Discount</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {returnOrder.products?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-medium">{item.productName}</td>
                          <td className="p-2.5 text-center">{item.orderQuantity}</td>
                          <td className="p-2.5 text-right">৳{item.unitPrice}</td>
                          <td className="p-2.5 text-right text-orange-600 font-medium">
                            {item.discountAmount > 0 ? (
                              <span>
                                {item.discountValue}
                                {item.discountType === "fixed" ? "৳" : "%"} (-৳{item.discountAmount})
                              </span>
                            ) : (
                              "৳0"
                            )}
                          </td>
                          <td className="p-2.5 text-right font-semibold text-emerald-600">
                            ৳{item.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment History Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5">
                  <History className="size-4 text-teal-600" /> Payment History
                </h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2 text-right">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Array.isArray(returnOrder.payments) && returnOrder.payments.length > 0 ? (
                        returnOrder.payments.map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium">
                              {p.date ? new Date(p.date).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="p-2 text-right font-bold text-emerald-600">
                              ৳{p.amount}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="p-3 text-center text-gray-400">
                            No payment history recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Calculation */}
              <div className="flex justify-end">
                <div className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Grand Total:</span>
                    <span className="text-gray-800">৳{returnOrder.grandTotal}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Paid Amount:</span>
                    <span>৳{paidTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-rose-600 border-t pt-1">
                    <span>Due Amount:</span>
                    <span>৳{dueTotal}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-2 py-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SingleSellReturn;