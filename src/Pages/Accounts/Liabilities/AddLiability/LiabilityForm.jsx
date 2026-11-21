// components/LiabilityForm.jsx
import React, { useState } from "react";

const LiabilityForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    liabilityHead: "",
    liabilitySubHead: "",
    liabilitySource: "Service", // Default options: Service, Supplier, Cash, Bank
    sourceDetails: "", // Free text input field
    amount: "",
    note: "",
  });

  // Dynamic Head and Sub-Head Mapping
  const headToSubHeadMap = {
    "Office Expense": ["Utility", "Rent", "Snacks", "Stationery"],
    "Materials": ["Crown", "Denture", "Orthopedics"],
    "Sales & Marketing": ["Transportation", "Advertising"],
    "Employee": ["Salary", "Entertainment"],
    "Other": ["Bank Charge", "Maintenance", "Legal Expense"],
  };

  const headOptions = Object.keys(headToSubHeadMap);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset Sub-Head if main Head is changed
      if (name === "liabilityHead") {
        updated.liabilitySubHead = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, resetForm);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      liabilityHead: "",
      liabilitySubHead: "",
      liabilitySource: "Service",
      sourceDetails: "",
      amount: "",
      note: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Empty placeholder for grid alignment */}
        <div className="hidden md:block"></div>

        {/* 2. Liability Head */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Liability Head <span className="text-rose-500">*</span>
          </label>
          <select
            name="liabilityHead"
            value={formData.liabilityHead}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Select Head</option>
            {headOptions.map((head, idx) => (
              <option key={idx} value={head}>
                {head}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Liability Sub-Head */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Liability Sub-Head <span className="text-rose-500">*</span>
          </label>
          <select
            name="liabilitySubHead"
            value={formData.liabilitySubHead}
            onChange={handleChange}
            required
            disabled={!formData.liabilityHead}
            className="w-full border border-slate-300 rounded-xl p-3 font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Select Sub-Head</option>
            {formData.liabilityHead &&
              headToSubHeadMap[formData.liabilityHead]?.map((sub, idx) => (
                <option key={idx} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>

        {/* 4. Liability Source */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Liability Source <span className="text-rose-500">*</span>
          </label>
          <select
            name="liabilitySource"
            value={formData.liabilitySource}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="Service">Service</option>
            <option value="Supplier">Supplier</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
        </div>

        {/* 5. Source Details / Entity Name (Free-text input) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Source Details / Provider Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="sourceDetails"
            placeholder="e.g. Vendor Name, Service Details or Bank Name"
            value={formData.sourceDetails}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* 6. Amount (Note-এর ঠিক উপরে) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Amount (৳) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-slate-300 rounded-xl p-3 font-bold text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* 7. Note */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Note / Particulars
        </label>
        <textarea
          name="note"
          rows="3"
          placeholder="Enter additional details or remarks..."
          value={formData.note}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
        ></textarea>
      </div>

      {/* 8. Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          Submit Liability
        </button>
      </div>
    </form>
  );
};

export default LiabilityForm;