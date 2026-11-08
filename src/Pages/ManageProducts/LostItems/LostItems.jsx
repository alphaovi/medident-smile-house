import { useState, useEffect } from "react";
import { Eye, Edit } from "lucide-react";
import { useLostDamageSampleItem } from "../../../services/useLostDamageSampleItem";
import LostItemsModal from "./LostItemsModal";

const LostItems = () => {
  const { getAllLostDamageSamples } = useLostDamageSampleItem();
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false); // ভিউ মোড ট্র্যাক করার জন্য স্টেট

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const data = await getAllLostDamageSamples();
      setAdjustments(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error("Failed to fetch adjustments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsViewMode(false); // এডিট মোড
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (item) => {
    setEditingItem(item);
    setIsViewMode(true); // ভিউ মোড (এডিট করা যাবে না)
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lost, Damage & Free Sample Records</h1>
          <p className="text-sm text-gray-500 mt-1">View all inventory adjustments and recorded losses.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
        >
          + Add Adjustment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b">
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Product Name</th>
                <th className="py-4 px-4 text-center">Type</th>
                <th className="py-4 px-4 text-center">Quantity</th>
                <th className="py-4 px-4">Referred By</th>
                <th className="py-4 px-4">Updated By</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">Loading records...</td>
                </tr>
              ) : adjustments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 font-medium">No records found.</td>
                </tr>
              ) : (
                adjustments.map((item, idx) => {
                  const type = item.adjustmentType;
                  const badgeColor = 
                    type === "Lost" ? "bg-rose-100 text-rose-700" :
                    type === "Damaged" || type === "Damage" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700";

                  return (
                    <tr key={item._id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-gray-600 text-xs">
                        {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        {item.product?.productName || item.product?.name || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
                          {type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium text-xs">
                        {item.referredBy || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">
                        {item.updatedBy || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Button (Eye Icon) */}
                          <button
                            onClick={() => handleOpenViewModal(item)}
                            title="View Details"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="size-4" />
                          </button>
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Record"
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1 px-2.5 text-xs font-semibold"
                          >
                            <Edit className="size-3.5" /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LostItemsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          setIsViewMode(false);
        }}
        onSuccess={fetchAdjustments}
        editData={editingItem}
        isViewMode={isViewMode} // প্রপ হিসেবে পাস করা হলো
      />
    </div>
  );
};

export default LostItems;