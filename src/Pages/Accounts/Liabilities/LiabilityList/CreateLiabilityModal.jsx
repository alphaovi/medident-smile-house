import  { useState } from "react";

const headToSubHeadMap = {
  "Office Expense": ["Utility", "Rent", "Snacks", "Stationery"],
  "Materials": ["Crown", "Denture", "Orthopedics"],
  "Sales & Marketing": ["Transportation", "Advertising"],
  "Employee": ["Salary", "Entertainment"],
  "Other": ["Bank Charge", "Maintenance", "Legal Expense"],
};

const CreateLiabilityModal = ({ isOpen, onClose, onSave }) => {
  const initialHead = Object.keys(headToSubHeadMap)[0];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    liabilityHead: initialHead,
    liabilitySubHead: headToSubHeadMap[initialHead][0],
    source: "Cash",
    sourceDetails: "",
    amount: "",
    status: "Due", // Default status is Due
    paidDate: new Date().toISOString().split("T")[0], // If Paid directly
    partialAmount: "", // If Partial payment
    note: "",
    payments: [],
  });

  if (!isOpen) return null;

  // Handle Head change & update Sub-Head dynamically
  const handleHeadChange = (e) => {
    const selectedHead = e.target.value;
    const availableSubHeads = headToSubHeadMap[selectedHead] || [];
    setFormData((prev) => ({
      ...prev,
      liabilityHead: selectedHead,
      liabilitySubHead: availableSubHeads[0] || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalPayments = [];
    const totalAmt = Number(formData.amount || 0);

    // Process payment history based on status
    if (formData.status === "Paid") {
      finalPayments = [
        {
          id: `PAY-${Date.now()}`,
          date: formData.paidDate,
          amount: totalAmt,
          paymentMethod: formData.source,
          note: "Full payment made on creation",
        },
      ];
    } else if (formData.status === "Partial") {
      const pAmount = Number(formData.partialAmount || 0);
      if (pAmount > 0) {
        finalPayments = [
          {
            id: `PAY-${Date.now()}`,
            date: formData.paidDate,
            amount: pAmount,
            paymentMethod: formData.source,
            note: "Initial partial payment",
          },
        ];
      }
    }

    const newLiability = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      amount: totalAmt,
      payments: finalPayments,
    };

    onSave(newLiability);
    onClose();
  };

  const remainingDue =
    formData.status === "Partial"
      ? Number(formData.amount || 0) - Number(formData.partialAmount || 0)
      : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Create New Transaction
            </h3>
            <p className="text-xs text-slate-500">
              Add new expense or liability entry
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Transaction Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Total Amount (৳) *
              </label>
              <input
                type="number"
                name="amount"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Head */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Head *
              </label>
              <select
                name="liabilityHead"
                value={formData.liabilityHead}
                onChange={handleHeadChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.keys(headToSubHeadMap).map((head, idx) => (
                  <option key={idx} value={head}>
                    {head}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Head */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sub Head *
              </label>
              <select
                name="liabilitySubHead"
                value={formData.liabilitySubHead}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {(headToSubHeadMap[formData.liabilityHead] || []).map(
                  (sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Payment Source */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Payment Source / Method
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Banking">Mobile Banking (bKash/Nagad)</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Payment Status (Only Due, Partial, Paid) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Payment Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 font-bold rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Due">Due (টাকা বাকি)</option>
                <option value="Partial">Partial (কিছু টাকা দেওয়া হয়েছে)</option>
                <option value="Paid">Paid (ফুল টাকা দেওয়া হয়েছে)</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC PAYMENT DETAILS BASED ON STATUS */}

          {/* 1. If Status is PAID */}
          {formData.status === "Paid" && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-3">
              <span className="text-xs font-bold text-emerald-800 block">
                Payment Information (Full Paid)
              </span>
              <div>
                <label className="block text-xs font-semibold text-emerald-700 mb-1">
                  Paid Date (কবে টাকা দেওয়া হলো) *
                </label>
                <input
                  type="date"
                  name="paidDate"
                  required
                  value={formData.paidDate}
                  onChange={handleChange}
                  className="w-full border border-emerald-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. If Status is PARTIAL */}
          {formData.status === "Partial" && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-800 block">
                Partial Payment Details
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-700 mb-1">
                    Payment Date (কবে দিল) *
                  </label>
                  <input
                    type="date"
                    name="paidDate"
                    required
                    value={formData.paidDate}
                    onChange={handleChange}
                    className="w-full border border-amber-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-700 mb-1">
                    Paid Amount (কত টাকা দিল) *
                  </label>
                  <input
                    type="number"
                    name="partialAmount"
                    required
                    placeholder="0.00"
                    value={formData.partialAmount}
                    onChange={handleChange}
                    className="w-full border border-amber-300 rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
              <div className="text-xs font-bold text-rose-600 text-right pt-1">
                Remaining Due: ৳{remainingDue > 0 ? remainingDue : 0}
              </div>
            </div>
          )}

          {/* 3. If Status is DUE */}
          {formData.status === "Due" && (
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-700 font-semibold text-center">
              No payment entry added now. Full amount (৳{formData.amount || 0}) will remain DUE.
            </div>
          )}

          {/* Source Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Source Details / Account Info
            </label>
            <input
              type="text"
              name="sourceDetails"
              placeholder="e.g. DBBL A/C 1234 or Cash drawer"
              value={formData.sourceDetails}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Note / Remarks
            </label>
            <textarea
              name="note"
              rows="2"
              placeholder="Additional details..."
              value={formData.note}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLiabilityModal;