import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PackagePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGroups, fetchSubGroups } from "../../../services/addProduct/addProductServiceRequest";

const AddProductFormModal = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  // 🟢 TanStack Query দিয়ে সরাসরি লেটেস্ট গ্রুপ এবং সাবগ্রুপ ফেচ করা হলো (যাতে সবসময় ফ্রেশ ডেটা থাকে)
  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 0, // ডেটা সাথে সাথে ফ্রেশ হিসেবে গণ্য হবে
    refetchOnMount: "always", // মোদাল ওপেন হলেই ব্যাকগ্রাউন্ড বা ক্যাশ থেকে লেটেস্ট ডেটা সিঙ্ক করবে
  });

  const { data: subGroupsList = [] } = useQuery({
    queryKey: ["subgroups"],
    queryFn: fetchSubGroups,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [filteredSubGroups, setFilteredSubGroups] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productGroup: "",
    productSubGroup: "",
    selectedUnit: "pcs",
    purchasePrice: "",
    unitPrice: "",
    weight: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: "",
        productName: "",
        productGroup: "",
        productSubGroup: "",
        selectedUnit: "pcs",
        purchasePrice: "",
        unitPrice: "",
        weight: "",
      });
      setSelectedGroupId("");
      setFilteredSubGroups([]);
    }
  }, [isOpen]);

  // গ্রুপ পরিবর্তনের সাথে সাথে সাবগ্রুপ ফিল্টার করা
  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);

    if (groupId) {
      const matchedSubs = subGroupsList.filter((sub) => {
        const subGroupRef =
          typeof sub.group === "string" ? sub.group : sub.group?._id;
        return subGroupRef === groupId;
      });
      setFilteredSubGroups(matchedSubs);
    } else {
      setFilteredSubGroups([]);
    }

    setFormData((prev) => ({
      ...prev,
      productGroup: groupId,
      productSubGroup: "",
    }));
  };

  const handleSubGroupChange = (e) => {
    const subId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      productSubGroup: subId,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "productId" && value.length > 10) return; // সর্বোচ্চ ১০ ক্যারেক্টার রেস্ট্রিকশন
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300">
              <div className="flex items-center gap-2">
                <PackagePlus className="size-5 text-primary" />
                <h3 className="font-bold text-lg">Add New Product</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-semibold">
                    Product ID (Max 10 chars) <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="productId"
                    required
                    maxLength={10}
                    placeholder="e.g. 103-2025"
                    value={formData.productId}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold">
                    Product Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    required
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm"
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold">
                    Product Group <span className="text-error">*</span>
                  </label>
                  <select
                    name="productGroup"
                    required
                    value={formData.productGroup}
                    onChange={handleGroupChange}
                    className="select select-bordered w-full text-sm"
                  >
                    <option value="">Select Group</option>
                    {groups.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.groupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-xs font-semibold">
                    Product Sub Group <span className="text-error">*</span>
                  </label>
                  <select
                    name="productSubGroup"
                    required
                    value={formData.productSubGroup}
                    onChange={handleSubGroupChange}
                    disabled={!selectedGroupId}
                    className="select select-bordered w-full text-sm"
                  >
                    <option value="">Select Sub Group</option>
                    {filteredSubGroups.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subGroupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-xs font-semibold">Unit</label>
                  <select
                    name="selectedUnit"
                    value={formData.selectedUnit}
                    onChange={handleChange}
                    className="select select-bordered w-full text-sm"
                  >
                    <option value="pcs">pcs</option>
                    <option value="cartoon">cartoon</option>
                    <option value="box">box</option>
                    <option value="gm">gm</option>
                    <option value="kg">kg</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs font-semibold">Weight</label>
                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    placeholder="0"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm"
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold">
                    Purchase Price (৳)
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    placeholder="0.00"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm"
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold">
                    Selling Price (৳)
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    placeholder="0.00"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-base-300 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm px-6">
                  Save Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddProductFormModal;