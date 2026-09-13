import { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  groups = [],
  onUpdateProduct,
}) => {
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productGroup: "",
    productSubGroup: "",
    buyingPrice: 0,
    sellingPrice: 0,
    weight: 1,
    unit: "Pcs",
  });

  const [availableSubGroups, setAvailableSubGroups] = useState([]);

  // ১. প্রোডাক্ট এবং গ্রুপ ডেটা লোড করার ইফেক্ট
  useEffect(() => {
    if (product) {
      // সব ধরনের পসিবল কি (key) নাম হ্যান্ডেল করা
      const selectedGroup =
        product.productGroup || product.group || product.groupName || "";
      const selectedSubGroup =
        product.productSubGroup ||
        product.subGroup ||
        product.subGroupName ||
        "";

      setFormData({
        ...product,
        productId: product.productId || product.code || product.id || "",
        productName: product.productName || product.name || "",
        productGroup: selectedGroup,
        productSubGroup: selectedSubGroup,
        buyingPrice:
          product.buyingPrice ??
          product.unitPrice ??
          product.tpPrice ??
          product.price ??
          0,
        sellingPrice: product.sellingPrice ?? product.MRP ?? product.mrp ?? 0,
        weight: product.weight || 1,
        unit: product.selectedUnit || product.unit || "Pcs",
      });

      // গ্রুপ ম্যাচ করে সাব-গ্রুপ লিস্ট রেডি করা
      if (selectedGroup && groups && groups.length > 0) {
        updateSubGroupsList(selectedGroup, groups);
      }
    }
  }, [product, groups]);

  // সাব-গ্রুপগুলো খুঁজে বের করার হেল্পার ফাংশন
  const updateSubGroupsList = (groupName, groupsList) => {
    if (!groupName || !groupsList) return;

    const foundGroupObj = groupsList.find((g) => {
      const name = g.groupName || g.name || g.group || "";
      return name.toLowerCase() === groupName.toLowerCase();
    });

    if (foundGroupObj) {
      const subList =
        foundGroupObj.subGroups ||
        foundGroupObj.subgroups ||
        foundGroupObj.subGroup ||
        [];
      setAvailableSubGroups(subList);
    } else {
      setAvailableSubGroups([]);
    }
  };

  // গ্রুপ চেঞ্জ হলে
  const handleGroupChange = (e) => {
    const selectedGroup = e.target.value;
    setFormData((prev) => ({
      ...prev,
      productGroup: selectedGroup,
      productSubGroup: "", // নতুন গ্রুপ সিলেক্ট করলে আগের সাব-গ্রুপ রিসেট হবে
    }));

    updateSubGroupsList(selectedGroup, groups);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["buyingPrice", "sellingPrice", "weight"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  if (!isOpen || !product) return null;

  // ফর্ম সাবমিশন এবং সুইট অ্যালার্ট
  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Update Product?",
      text: "Are you sure you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      customClass: {
        popup:
          "rounded-lg p-5 max-w-sm text-left font-sans shadow-xl border border-gray-200",
        title:
          "text-lg font-bold text-gray-800 text-left border-b border-gray-200 pb-3 mb-3",
        htmlContainer: "text-gray-600 text-sm text-left my-3 font-normal",
        actions:
          "flex justify-end gap-2 border-t border-gray-200 pt-3 mt-3 w-full",
        confirmButton:
          "bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded border-0 text-sm",
        cancelButton:
          "bg-white hover:bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateProduct(formData);

        toast.success("Product updated successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
        });

        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Edit3 className="size-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Edit Product Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">
              Product Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full input input-sm input-bordered focus:outline-teal-600"
                />
              </div>

              {/* Group Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Product Group
                </label>
                <select
                  name="productGroup"
                  value={formData.productGroup}
                  onChange={handleGroupChange}
                  className="w-full select select-sm select-bordered focus:outline-teal-600"
                >
                  <option value="">Select Group...</option>
                  {groups && groups.length > 0
                    ? groups.map((group, idx) => {
                        const gName =
                          group.groupName || group.name || group.group || group;
                        return (
                          <option key={idx} value={gName}>
                            {gName}
                          </option>
                        );
                      })
                    : formData.productGroup && (
                        <option value={formData.productGroup}>
                          {formData.productGroup}
                        </option>
                      )}
                </select>
              </div>

              {/* Sub Group Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Product Sub Group
                </label>
                <select
                  name="productSubGroup"
                  value={formData.productSubGroup}
                  onChange={handleChange}
                  disabled={!formData.productGroup}
                  className="w-full select select-sm select-bordered focus:outline-teal-600 disabled:bg-gray-100"
                >
                  <option value="">Select Sub Group...</option>
                  {availableSubGroups && availableSubGroups.length > 0
                    ? availableSubGroups.map((subGroup, idx) => {
                        const subName =
                          typeof subGroup === "string"
                            ? subGroup
                            : subGroup.name ||
                              subGroup.subGroupName ||
                              subGroup.title;
                        return (
                          <option key={idx} value={subName}>
                            {subName}
                          </option>
                        );
                      })
                    : formData.productSubGroup && (
                        <option value={formData.productSubGroup}>
                          {formData.productSubGroup}
                        </option>
                      )}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Unit Details */}
          <div className="p-5 border border-gray-200 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">
              Pricing & Unit Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Buying Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Buying Price (৳)
                </label>
                <input
                  type="number"
                  name="buyingPrice"
                  min="0"
                  value={formData.buyingPrice}
                  onChange={handleChange}
                  className="w-full input input-sm input-bordered focus:outline-teal-600"
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Selling Price (৳)
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className="w-full input input-sm input-bordered focus:outline-teal-600"
                />
              </div>

              {/* Unit Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full select select-sm select-bordered focus:outline-teal-600"
                >
                  <option value="Pcs">Pcs</option>
                  <option value="Kg">Kg</option>

                  <option value="Box">Box</option>
                  <option value="Packet">Packet</option>
                </select>
              </div>

              {/* Weight / Unit */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Wt / Unit (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full input input-sm input-bordered focus:outline-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-6 border-0"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
