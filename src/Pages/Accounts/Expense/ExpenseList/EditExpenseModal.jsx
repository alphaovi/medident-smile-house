import { useState } from "react";

const EditExpenseModal = ({ expense, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...expense });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-extrabold text-slate-800">
            Edit Expense ({expense.id})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Amount (৳)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Paid From
            </label>
            <input
              type="text"
              value={formData.paidFrom}
              onChange={(e) =>
                setFormData({ ...formData, paidFrom: e.target.value })
              }
              className="w-full border p-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Note
            </label>
            <textarea
              rows="3"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full border p-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;