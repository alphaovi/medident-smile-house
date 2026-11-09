import { Printer } from "lucide-react";

const LostItemReportModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const type = data.adjustmentType;
  const badgeColor = 
    type === "Lost" ? "bg-rose-100 text-rose-700 border-rose-200" :
    type === "Damaged" || type === "Damage" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-purple-100 text-purple-700 border-purple-200";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all cursor-pointer z-10"
        >
          ✕
        </button>

        {/* Header Title */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Adjustment Report</h2>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">
                Ref ID: {data._id ? data._id.slice(-8).toUpperCase() : "N/A"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
              {type}
            </span>
          </div>
        </div>

        {/* Info Grid Card */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Adjustment Date</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {data.date ? new Date(data.date).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Updated By</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {data.updatedBy || "N/A"}
              </p>
            </div>
          </div>

          {data.customer && (
            <div className="pt-2 border-t border-gray-200/60">
              <p className="text-xs text-gray-400 font-medium">Customer Name</p>
              <p className="text-sm font-bold text-teal-700 mt-0.5">
                {data.customer.customerName || data.customer.name || data.customer.companyName || "N/A"}
              </p>
              {data.customer.phone && (
                <p className="text-xs text-gray-500">{data.customer.phone}</p>
              )}
            </div>
          )}

          {data.referredBy && (
            <div className="pt-2 border-t border-gray-200/60">
              <p className="text-xs text-gray-400 font-medium">Referred By</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {data.referredBy}
              </p>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="mb-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Adjusted Item:</p>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-800 text-base">
                {data.product?.productName || data.product?.name || "N/A"}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Quantity Adjusted: <span className="font-bold text-gray-700">{data.quantity} Units</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-medium">
                Qty: {data.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="size-4" /> Print Report
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default LostItemReportModal;