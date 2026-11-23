const BankModalFooter = ({ isEditing, submitting, onClose }) => (
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
      {submitting ? "Saving..." : isEditing ? "Update Bank" : "Save Bank"}
    </button>
  </div>
);

export default BankModalFooter;