import { useState, useEffect } from "react";
import {
  fetchGroups,
  fetchSubGroups,
  fetchProducts,
} from "../../../services/addProduct/addProductServiceRequest";
import { useLostDamageSampleItem } from "../../../services/useLostDamageSampleItem";
import { customerService } from '../../../services/useCustomerService/useCustomerService';

const LostItemsModal = ({ isOpen, onClose, onSuccess, editData, isViewMode }) => {
  const { createLostDamageSample, updateLostDamageSample, loading: apiLoading } =
    useLostDamageSampleItem();

  const [actionType, setActionType] = useState(""); 
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubgroup, setSelectedSubgroup] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const loadInitialData = async () => {
      try {
        const groupData = await fetchGroups();
        const subgroupData = await fetchSubGroups();
        const productData = await fetchProducts();
        const customerData = await customerService.getAllCustomers();

        setGroups(Array.isArray(groupData) ? groupData : (groupData?.data || []));
        setSubgroups(Array.isArray(subgroupData) ? subgroupData : (subgroupData?.data || []));
        setProducts(Array.isArray(productData) ? productData : (productData?.data || []));
        setCustomers(Array.isArray(customerData) ? customerData : (customerData?.data || []));
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setActionType(editData.adjustmentType || "");
      setQuantity(editData.quantity || "");
      setReferredBy(editData.referredBy || "");
      setUpdatedBy(editData.updatedBy || "");

      if (editData.customer) {
        if (typeof editData.customer === "object") {
          setSelectedCustomer(String(editData.customer._id || editData.customer.id || ""));
        } else {
          setSelectedCustomer(String(editData.customer));
        }
      } else {
        setSelectedCustomer("");
      }

      const prodObj = editData.product;
      if (prodObj) {
        const prodId = typeof prodObj === "object" ? String(prodObj._id || prodObj.id || "") : String(prodObj);
        setSelectedProduct(prodId);

        if (typeof prodObj === "object") {
          if (prodObj.group) {
            setSelectedGroup(typeof prodObj.group === "object" ? String(prodObj.group._id || prodObj.group.id || "") : String(prodObj.group));
          }
          if (prodObj.subGroup) {
            setSelectedSubgroup(typeof prodObj.subGroup === "object" ? String(prodObj.subGroup._id || prodObj.subGroup.id || "") : String(prodObj.subGroup));
          }
        }
      }
    } else {
      setActionType("");
      setSelectedGroup("");
      setSelectedSubgroup("");
      setSelectedProduct("");
      setSelectedCustomer("");
      setQuantity("");
      setReferredBy("");
      setUpdatedBy("");
    }
    setSuccessMessage("");
    setErrorMessage("");
  }, [editData, isOpen, customers, products]);

  const filteredSubgroups = subgroups.filter((sub) => {
    if (!selectedGroup) return false;
    const subGroupRef = sub.group || sub.groupId || sub.productGroup;
    if (!subGroupRef) return false;
    const subGroupIdStr = typeof subGroupRef === "object" && subGroupRef !== null
      ? String(subGroupRef._id || subGroupRef.id || "") 
      : String(subGroupRef);
    return subGroupIdStr === String(selectedGroup);
  });

  const filteredProducts = products.filter((prod) => {
    if (!selectedGroup || !selectedSubgroup) return false;
    const prodGroupRef = prod.group || prod.productGroup;
    const prodSubGroupRef = prod.subGroup || prod.subgroup || prod.productSubGroup;

    const prodGroupIdStr = typeof prodGroupRef === "object" && prodGroupRef !== null
      ? String(prodGroupRef._id || prodGroupRef.id || "") 
      : String(prodGroupRef || "");

    const prodSubGroupIdStr = typeof prodSubGroupRef === "object" && prodSubGroupRef !== null
      ? String(prodSubGroupRef._id || prodSubGroupRef.id || "") 
      : String(prodSubGroupRef || "");

    return (
      prodGroupIdStr === String(selectedGroup) &&
      prodSubGroupIdStr === String(selectedSubgroup)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return; // ভিউ মোডে সাবমিট হবে না

    setSuccessMessage("");
    setErrorMessage("");

    const selectedProdObj = products.find(
      (p) => String(p._id) === String(selectedProduct) || String(p.id) === String(selectedProduct)
    );
    const productUniqueId = selectedProdObj ? selectedProdObj.id : selectedProduct;

    const formData = {
      actionType, 
      productId: productUniqueId, 
      quantity: Number(quantity),
      referredBy,
      updatedBy,
      customer: actionType === "Free Sample" ? selectedCustomer : undefined,
    };

    let result;
    if (editData && (editData._id || editData.id)) {
      const updateId = editData._id || editData.id;
      result = await updateLostDamageSample(updateId, formData);
    } else {
      result = await createLostDamageSample(formData);
    }

    if (result.success) {
      setSuccessMessage(editData ? "Record updated successfully!" : "Record saved and inventory updated successfully!");

      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMessage(result.message || "Something went wrong!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all cursor-pointer z-10"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isViewMode ? "View Inventory Adjustment Details" : editData ? "Edit Inventory Adjustment" : "Inventory Adjustment (Free Sample / Lost / Damage)"}
        </h1>

        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md border border-green-300">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Action Type <span className="text-red-500">*</span>
            </label>
            <select
              value={actionType}
              disabled={isViewMode} // ভিউ মোডে ডিসেবল থাকবে
              onChange={(e) => {
                setActionType(e.target.value);
                setSelectedGroup("");
                setSelectedSubgroup("");
                setSelectedProduct("");
                setSelectedCustomer("");
              }}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">-- Choose Type --</option>
              <option value="Free Sample">Free Sample</option>
              <option value="Lost">Lost</option>
              <option value="Damaged">Damage</option>
            </select>
          </div>

          {actionType === "Free Sample" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Customer <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCustomer}
                disabled={isViewMode}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required={actionType === "Free Sample"}
              >
                <option value="">-- Select Customer --</option>
                {customers.map((cust) => {
                  const custId = String(cust._id || cust.id);
                  return (
                    <option key={custId} value={custId}>
                      {cust.customerName || cust.name || cust.companyName} {cust.phone ? `(${cust.phone})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {actionType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Group <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedGroup}
                disabled={isViewMode}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setSelectedSubgroup("");
                  setSelectedProduct("");
                }}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">-- Select Group --</option>
                {groups.map((group) => (
                  <option key={group._id || group.id} value={group._id || group.id}>
                    {group.name || group.groupName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedGroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subgroup <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubgroup}
                disabled={isViewMode}
                onChange={(e) => {
                  setSelectedSubgroup(e.target.value);
                  setSelectedProduct("");
                }}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">-- Select Subgroup --</option>
                {filteredSubgroups.map((sub) => (
                  <option key={sub._id || sub.id} value={sub._id || sub.id}>
                    {sub.name || sub.subGroupName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSubgroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProduct}
                disabled={isViewMode}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">-- Select Product --</option>
                {filteredProducts.map((prod) => (
                  <option key={prod._id || prod.id} value={prod._id || prod.id}>
                    {prod.productName || prod.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  disabled={isViewMode}
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referred By
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Enter name"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Enter your name"
                  value={updatedBy}
                  onChange={(e) => setUpdatedBy(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>
          )}

          {selectedProduct && (
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-semibold text-gray-700 cursor-pointer"
              >
                {isViewMode ? "Close" : "Cancel"}
              </button>
              
              {/* ভিউ মোড হলে আপডেট বাটন হাইড থাকবে */}
              {!isViewMode && (
                <button
                  type="submit"
                  disabled={apiLoading}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 cursor-pointer"
                >
                  {apiLoading ? "Submitting..." : editData ? "Update Record" : "Save Record"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LostItemsModal;