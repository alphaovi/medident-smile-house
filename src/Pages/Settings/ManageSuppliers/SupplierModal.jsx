import { X, Building2 } from "lucide-react";

const SupplierModal = ({
  isOpen,
  onClose,
  isEditing,
  currentId,
  supplierName,
  setSupplierName,
  supplierPhone,
  setSupplierPhone,
  supplierAddress,
  setSupplierAddress,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600 cursor-pointer" />
            {isEditing ? "Edit Supplier" : "Add New Supplier"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Supplier ID (Auto) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Supplier ID (Auto)
            </label>
            <input
              type="text"
              value={currentId}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-300 font-semibold cursor-not-allowed"
            />
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter supplier name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Supplier Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Supplier Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={supplierPhone}
              onChange={(e) => setSupplierPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Supplier Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Supplier Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Enter supplier address"
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            ></textarea>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              {isEditing ? "Update Supplier" : "Save Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
