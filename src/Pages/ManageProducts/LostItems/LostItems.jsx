import { useState, useEffect } from "react";
import {
  fetchGroups,
  fetchSubGroups,
  fetchProducts,
} from "../../../services/addProduct/addProductServiceRequest";
import { useLostDamageSampleItem } from "../../../services/useLostDamageSampleItem";
import { customerService } from '../../../services/useCustomerService/useCustomerService'

const LostItems = () => {
  const { createLostDamageSample, loading: apiLoading } =
    useLostDamageSampleItem();

  // State Management
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
  const [updatedBy, setUpdatedBy] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Initial Data Fetch (Group, Subgroup, Products, Customers)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const groupData = await fetchGroups();
        const subgroupData = await fetchSubGroups();
        const productData = await fetchProducts();
        
        // customerService ব্যবহার করে কাস্টমার ডেটা ফেচ করা হলো
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
  }, []);

  // Filtered Subgroups based on Selected Group
  const filteredSubgroups = subgroups.filter((sub) => {
    if (!selectedGroup) return false;
    
    const subGroupRef = sub.group || sub.groupId || sub.productGroup;
    if (!subGroupRef) return false;

    const subGroupIdStr = typeof subGroupRef === "object" && subGroupRef !== null
      ? String(subGroupRef._id || subGroupRef.id || "") 
      : String(subGroupRef);

    return subGroupIdStr === String(selectedGroup);
  });

  // Filtered Products based on Selected Group and Subgroup
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

  // Handle Form Submission using Service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // প্রোডাক্টের কাস্টম স্ট্রিং `id` (যেমন PROD-xxxx) বের করা
    const selectedProdObj = products.find(
      (p) => String(p._id) === String(selectedProduct) || String(p.id) === String(selectedProduct)
    );
    const productUniqueId = selectedProdObj ? selectedProdObj.id : selectedProduct;

    const formData = {
      actionType, // "Free Sample", "Lost", বা "Damaged"
      productId: productUniqueId, 
      quantity: Number(quantity),
      updatedBy,
      // যদি Free Sample হয় তবে কাস্টমার পাঠানো হবে
      customer: actionType === "Free Sample" ? selectedCustomer : undefined,
    };

    const result = await createLostDamageSample(formData);

    if (result.success) {
      setSuccessMessage("Record saved and inventory updated successfully!");

      // Reset Form
      setActionType("");
      setSelectedGroup("");
      setSelectedSubgroup("");
      setSelectedProduct("");
      setSelectedCustomer("");
      setQuantity("");
      setUpdatedBy("");
    } else {
      setErrorMessage(result.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Inventory Adjustment (Free Sample / Lost / Damage)
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
        {/* ১. Action Type ড্রপডাউন */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Action Type <span className="text-red-500">*</span>
          </label>
          <select
            value={actionType}
            onChange={(e) => {
              setActionType(e.target.value);
              setSelectedGroup("");
              setSelectedSubgroup("");
              setSelectedProduct("");
              setSelectedCustomer("");
            }}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choose Type --</option>
            <option value="Free Sample">Free Sample</option>
            <option value="Lost">Lost</option>
            <option value="Damaged">Damage</option>
          </select>
        </div>

        {/* ২. Customer ড্রপডাউন (শুধুমাত্র Free Sample সিলেক্ট করলে দেখাবে) */}
        {actionType === "Free Sample" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required={actionType === "Free Sample"}
            >
              <option value="">-- Select Customer --</option>
              {customers.length > 0 ? (
                customers.map((cust) => (
                  <option key={cust._id || cust.id} value={cust._id || cust.id}>
                    {cust.customerName || cust.name || cust.companyName} {cust.phone ? `(${cust.phone})` : ""}
                  </option>
                ))
              ) : (
                <option value="" disabled>No customers found</option>
              )}
            </select>
          </div>
        )}

        {/* ৩. Field Group ড্রপডাউন */}
        {actionType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Group <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setSelectedSubgroup("");
                setSelectedProduct("");
              }}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Group --</option>
              {groups.map((group) => (
                <option
                  key={group._id || group.id}
                  value={group._id}
                >
                  {group.name || group.groupName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ৪. Subgroup ড্রপডাউন */}
        {selectedGroup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subgroup <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSubgroup}
              onChange={(e) => {
                setSelectedSubgroup(e.target.value);
                setSelectedProduct("");
              }}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Subgroup --</option>
              {filteredSubgroups.length > 0 ? (
                filteredSubgroups.map((sub) => (
                  <option
                    key={sub._id || sub.id}
                    value={sub._id}
                  >
                    {sub.name || sub.subGroupName}
                  </option>
                ))
              ) : (
                <option value="" disabled>No subgroups found for this group</option>
              )}
            </select>
          </div>
        )}

        {/* ৫. Product Name ড্রপডাউন */}
        {selectedSubgroup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Product --</option>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <option key={prod._id || prod.id} value={prod._id || prod.id}>
                    {prod.productName || prod.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No products found in this subgroup</option>
              )}
            </select>
          </div>
        )}

        {/* ৬. Quantity এবং Updated By ফিল্ড */}
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Updated By (User/Employee){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name or ID"
                value={updatedBy}
                onChange={(e) => setUpdatedBy(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedProduct && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={apiLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
            >
              {apiLoading ? "Submitting..." : "Save Record"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LostItems;