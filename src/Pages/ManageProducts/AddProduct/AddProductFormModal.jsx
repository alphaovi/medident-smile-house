import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PackagePlus, Sparkles } from "lucide-react";
import { toast } from "react-toastify"; // Toastify Import

// Modal component to add a new product dynamically
const AddProductFormModal = ({ isOpen, onClose, onAddProduct, groups }) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [subGroups, setSubGroups] = useState([]);

  // Controlled Form State matching the JSON Schema
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productGroup: "",
    productSubGroup: "",
    selectedUnit: "pcs",
    purchasePrice: "",
    unitPrice: "",
    quantity: 1,
  });

  // Generate an automatic formatted Product ID when modal opens
  useEffect(() => {
    if (isOpen) {
      const generatedId = `PRD-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        productId: generatedId,
        productName: "",
        productGroup: "",
        productSubGroup: "",
        selectedUnit: "pcs",
        purchasePrice: "",
        unitPrice: "",
        quantity: 1,
      });
      setSelectedGroup("");
      setSubGroups([]);
    }
  }, [isOpen]);

  // Dynamic cascading dropdown: Update subgroups based on group selection
  const handleGroupChange = (e) => {
    const groupName = e.target.value;
    setSelectedGroup(groupName);

    // Find matched group item in JSON structure
    const groupObj = groups.find((g) => g.group === groupName);
    setSubGroups(groupObj ? groupObj.subGroup : []);

    setFormData((prev) => ({
      ...prev,
      productGroup: groupName,
      productSubGroup: "", // Reset subGroup on group change
    }));
  };

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission handler with Toastify notification
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(formData);

    // Toast Notification (Quick 2-second timeout)
    toast.success("New product added successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300">
              <div className="flex items-center gap-2">
                <PackagePlus className="size-5 text-primary" />
                <h3 className="font-bold text-lg">Add New Product</h3>
              </div>
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Auto Product ID */}
                <div>
                  <label className="label text-xs font-semibold">
                    Product ID (Auto)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="productId"
                      value={formData.productId}
                      disabled
                      className="input input-bordered w-full bg-base-200 font-mono text-sm font-semibold text-primary"
                    />
                    <Sparkles className="size-4 text-primary absolute right-3 top-3" />
                  </div>
                </div>

                {/* Product Name */}
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

                {/* Dynamic Product Group Dropdown */}
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
                    {groups.map((item, idx) => (
                      <option key={idx} value={item.group}>
                        {item.group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Product Sub-Group Dropdown */}
                <div>
                  <label className="label text-xs font-semibold">
                    Product Sub Group <span className="text-error">*</span>
                  </label>
                  <select
                    name="productSubGroup"
                    required
                    value={formData.productSubGroup}
                    onChange={handleChange}
                    disabled={!selectedGroup}
                    className="select select-bordered w-full text-sm"
                  >
                    <option value="">Select Sub Group</option>
                    {subGroups.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Selection */}
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
                  </select>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="label text-xs font-semibold">
                    Quantity / Stock
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm"
                  />
                </div>

                {/* Purchase Price */}
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

                {/* Selling Unit Price */}
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

              {/* Submit Buttons */}
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