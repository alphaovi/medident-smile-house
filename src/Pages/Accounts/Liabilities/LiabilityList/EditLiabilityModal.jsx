import  { useState } from "react";

const EditLiabilityModal = ({ liability, headToSubHeadMap, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...liability });

  const handleHeadChange = (e) => {
    const newHead = e.target.value;
    const availableSubHeads = headToSubHeadMap[newHead] || [];
    setFormData((prev) => ({
      ...prev,
      liabilityHead: newHead,
      liabilitySubHead: availableSubHeads[0] || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Edit Transaction ({formData.id})</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Head</label>
              <select
                name="liabilityHead"
                value={formData.liabilityHead || ""}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sub Head</label>
              <select
                name="liabilitySubHead"
                value={formData.liabilitySubHead || ""}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {(headToSubHeadMap[formData.liabilityHead] || []).map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                name="status"
                value={formData.status || "Due"}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Due">Due</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source || ""}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ""}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Source Details</label>
            <input
              type="text"
              name="sourceDetails"
              value={formData.sourceDetails || ""}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Note</label>
            <textarea
              name="note"
              rows="2"
              value={formData.note || ""}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLiabilityModal;