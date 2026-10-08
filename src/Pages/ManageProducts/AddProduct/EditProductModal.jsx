import { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditProductModal = ({ isOpen, onClose, product, groups = [], onUpdateProduct }) => {
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productGroup: "",
    productSubGroup: "",
    buyingPrice: 0,
    sellingPrice: 0,
    weight: 0,
    unit: "pcs",
  });

  const [availableSubGroups, setAvailableSubGroups] = useState([]);

  // Subgroups fetch korar ba filter korar function
  const fetchSubgroupsForGroup = async (groupId) => {
    if (!groupId) {
      setAvailableSubGroups([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/product-subgroups`);
      const allSubgroups = res.data.data || res.data || [];
      
      const filtered = allSubgroups.filter((sub) => {
        const subGroupRef = typeof sub.group === "object" ? sub.group?._id : sub.group;
        return subGroupRef === groupId;
      });
      setAvailableSubGroups(filtered);
    } catch (error) {
      setAvailableSubGroups([]);
    }
  };

  useEffect(() => {
    if (product && isOpen) {
      const groupId = typeof product.group === "object" ? product.group?._id : product.group;
      const subGroupId = typeof product.subGroup === "object" ? product.subGroup?._id : product.subGroup;

      setFormData({
        ...product,
        productId: product.code || product.id || product.productId || "",
        productName: product.name || product.productName || "",
        productGroup: groupId || "",
        productSubGroup: subGroupId || "",
        buyingPrice: product.purchasePrice ?? product.buyingPrice ?? 0,
        sellingPrice: product.sellingPrice ?? 0,
        weight: product.weight || 0,
        unit: product.unit || "pcs",
      });

      if (groupId) {
        fetchSubgroupsForGroup(groupId);
      } else {
        setAvailableSubGroups([]);
      }
    }
  }, [product, isOpen]);

  const handleGroupChange = (e) => {
    const selectedGroupId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      productGroup: selectedGroupId,
      productSubGroup: "", 
    }));
    fetchSubgroupsForGroup(selectedGroupId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["buyingPrice", "sellingPrice", "weight"].includes(name) ? Number(value) : value,
    }));
  };

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Update Product?",
      text: "Are you sure you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-sm",
        cancelButton: "bg-white hover:bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Product er ID ensure kora hoise (_id, id ba code theke)
        const productId = product._id || product.id || product.code;

        const updatePayload = {
          id: productId,
          productName: formData.productName,
          productGroup: formData.productGroup,       
          productSubGroup: formData.productSubGroup, 
          buyingPrice: Number(formData.buyingPrice),
          sellingPrice: Number(formData.sellingPrice),
          unit: formData.unit,
          weight: Number(formData.weight || 0),
        };

        onUpdateProduct(updatePayload);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Edit3 className="size-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-800">Edit Product Details</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">Product Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full input input-sm input-bordered" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Group</label>
                <select name="productGroup" value={formData.productGroup} onChange={handleGroupChange} className="w-full select select-sm select-bordered" required>
                  <option value="">Select Group...</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.groupName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Sub Group</label>
                <select name="productSubGroup" value={formData.productSubGroup} onChange={handleChange} disabled={!formData.productGroup} className="w-full select select-sm select-bordered" required>
                  <option value="">Select Sub Group...</option>
                  {availableSubGroups.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subGroupName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 border border-gray-200 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">Pricing & Unit Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Buying Price (৳)</label>
                <input type="number" name="buyingPrice" min="0" value={formData.buyingPrice} onChange={handleChange} className="w-full input input-sm input-bordered" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (৳)</label>
                <input type="number" name="sellingPrice" min="0" value={formData.sellingPrice} onChange={handleChange} className="w-full input input-sm input-bordered" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full select select-sm select-bordered">
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="box">box</option>
                  <option value="cartoon">cartoon</option>
                  <option value="pack">pack</option>
                  <option value="set">set</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Weight</label>
                <input type="number" name="weight" step="0.01" min="0" value={formData.weight} onChange={handleChange} className="w-full input input-sm input-bordered" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn btn-sm btn-ghost text-gray-600">
              Cancel
            </button>
            <button type="submit" className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-6 border-0">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;