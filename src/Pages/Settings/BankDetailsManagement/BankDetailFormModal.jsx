import { useState, useEffect } from "react";

const INITIAL_FORM = {
  bankName: "",
  accountNo: "",
  accountName: "",
  branch: "",
  details: "",
  isActive: true,
};

const BankDetailFormModal = ({
  isOpen,
  onClose,
  onSave,
  editingBank = null,
  submitting = false,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (editingBank) {
      setFormData({
        bankName: editingBank.bankName || "",
        accountNo: editingBank.accountNo || "",
        accountName: editingBank.accountName || "",
        branch: editingBank.branch || "",
        details: editingBank.details || "",
        isActive: editingBank.isActive !== undefined ? Boolean(editingBank.isActive) : true,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [editingBank, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      bankName: formData.bankName.trim(),
      accountNo: formData.accountNo.trim(),
      accountName: formData.accountName.trim(),
      branch: formData.branch.trim(),
      details: formData.details.trim(),
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              {editingBank ? "Update Bank Detail" : "Add New Bank Detail"}
            </h3>
            <p className="text-xs text-sky-100 mt-0.5">
              {editingBank
                ? "Modify bank account information and save changes."
                : "Enter bank account details for payment collection."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                required
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. Dutch-Bangla Bank PLC"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="accountNo"
                required
                value={formData.accountNo}
                onChange={handleChange}
                placeholder="e.g. 123.101.456789"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="accountName"
                required
                value={formData.accountName}
                onChange={handleChange}
                placeholder="e.g. Medident Dental Care"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Mirpur-10 Branch"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Details / Routing Info
            </label>
            <textarea
              name="details"
              rows={3}
              value={formData.details}
              onChange={handleChange}
              placeholder="Routing number, SWIFT code, or special instructions..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-700">Active Account</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
            >
              {submitting
                ? "Saving..."
                : editingBank
                ? "Update Bank"
                : "Save Bank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetailFormModal;