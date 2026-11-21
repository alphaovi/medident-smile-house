// components/EditAssetModal.jsx
import { useState } from "react";

const EditAssetModal = ({ asset, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...asset });

  const isLocked = formData.status === "Bought" || formData.status === "Sold";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Edit Asset ({asset.id})</h3>
            <p className="text-xs text-slate-300">Update asset details and payment records</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {isLocked && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl font-medium">
              ⚠️ Note: Status is marked as <b>{formData.status}</b>. Critical fields are locked for data consistency.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Asset Head
              </label>
              <input
                type="text"
                name="assetHead"
                value={formData.assetHead}
                onChange={handleChange}
                required
                disabled={isLocked}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sub-Head
              </label>
              <input
                type="text"
                name="assetSubHead"
                value={formData.assetSubHead}
                onChange={handleChange}
                required
                disabled={isLocked}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={isLocked}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Payment Account
            </label>
            <input
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Note
            </label>
            <textarea
              name="note"
              rows="3"
              value={formData.note}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssetModal;