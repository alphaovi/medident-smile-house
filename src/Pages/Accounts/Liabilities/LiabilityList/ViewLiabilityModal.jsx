import React from "react";

const ViewLiabilityModal = ({ liability, onClose }) => {
  if (!liability) return null;

  // মোট কত টাকা পরিশোধ করা হয়েছে তার হিসেব
  const totalPaid =
    liability.payments && liability.payments.length > 0
      ? liability.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
      : liability.status === "Paid" || liability.status === "Approved"
      ? Number(liability.amount)
      : 0;

  const dueAmount = Number(liability.amount) - totalPaid;

  // স্ট্যাটাস অনুযায়ী ব্যাজের কালার
  const getBadgeStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Approved":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Partial":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  // সব ধরনের পেমেন্টের জন্য ডাটা লিস্ট তৈরি
  const getPaymentList = () => {
    if (liability.payments && liability.payments.length > 0) {
      return liability.payments;
    }
    // যদি সিঙ্গেল অবজেক্ট হিসেবে ডাটা থাকে (Paid বা Approved এর ক্ষেত্রে)
    if (liability.status === "Paid" || liability.status === "Approved") {
      return [
        {
          date: liability.paidDate || liability.date,
          paymentMethod: liability.source || "N/A",
          note: liability.note || "Full amount cleared",
          amount: liability.amount,
        },
      ];
    }
    return [];
  };

  const paymentList = getPaymentList();

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Transaction Details ({liability.id})
            </h3>
            <p className="text-xs text-slate-500">Read-only View</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Date</span>
              <span className="text-sm font-semibold text-slate-800">{liability.date}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Head</span>
              <span className="text-sm font-semibold text-slate-800">{liability.liabilityHead}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Sub Head</span>
              <span className="text-sm font-semibold text-slate-800">{liability.liabilitySubHead}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Source</span>
              <span className="text-sm font-semibold text-slate-800">{liability.source || "-"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Source Details</span>
              <span className="text-sm font-semibold text-slate-800">{liability.sourceDetails || "-"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Amount</span>
              <span className="text-sm font-bold text-slate-900">৳{liability.amount}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Status</span>
              <span
                className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                  liability.status
                )}`}
              >
                {liability.status}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-slate-400 block">Note</span>
              <span className="text-sm text-slate-600">{liability.note || "N/A"}</span>
            </div>
          </div>

          {/* Payment Section (Unifies design for Partial, Approved & Paid) */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-bold text-slate-800 mb-3">
              Payment Information & History
            </h4>

            {liability.status === "Due" ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-4 rounded-xl text-center">
                No payment has been made yet. Full amount (৳{liability.amount}) is currently DUE.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Single Universal Table for Approved, Partial, and Paid */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Date (তারিখ)</th>
                        <th className="p-2.5">Method / Source</th>
                        <th className="p-2.5">Note</th>
                        <th className="p-2.5 text-right">Amount (টাকা)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentList.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-slate-800 whitespace-nowrap">
                            {p.date}
                          </td>
                          <td className="p-2.5 text-slate-700">
                            {p.paymentMethod || liability.source || "N/A"}
                          </td>
                          <td className="p-2.5 text-slate-500">{p.note || "-"}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-700">
                            ৳{p.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary Bar */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">
                    Total Paid / Cleared: <strong className="text-emerald-600">৳{totalPaid}</strong>
                  </span>
                  <span className="font-semibold text-slate-700">
                    Remaining Due:{" "}
                    <strong className={dueAmount > 0 ? "text-rose-600" : "text-slate-500"}>
                      ৳{dueAmount > 0 ? dueAmount : 0}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLiabilityModal;