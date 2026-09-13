import React, { useState, useEffect } from "react";
import { PlusCircle, ShoppingBag } from "lucide-react";
import PurchaseOrderModal from "./PurchaseOrderModal/PurchaseOrderModal";
import PurchaseOrderList from "./PurchaseOrderList/PurchaseOrderList"; // Import the table list component

const PurchaseOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  
  // State variables for dynamic JSON data
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch JSON files from public folder
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resGroups] = await Promise.all([
          fetch("/products.json"),
          fetch("/productsGroupSubgroup.json")
        ]);

        const productsData = await resProducts.json();
        const groupsData = await resGroups.json();

        setProducts(productsData);
        setProductsGroupSubgroup(groupsData);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveStoreProduct = (purchaseBatchData) => {
    console.log("Saved Purchase Batch Data:", purchaseBatchData);
    setPurchaseHistory((prev) => [purchaseBatchData, ...prev]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="size-7 text-teal-600" />
            Purchase Orders
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Create batch purchase orders and update product inventory stock.
          </p>
        </div>

        {/* Modal Open Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="btn text-white bg-teal-600 hover:bg-teal-700 btn-md gap-2 shadow-md border-0 disabled:opacity-50 cursor-pointer"
        >
          <PlusCircle className="size-5" />
          {isLoading ? "Loading Data..." : "Create Purchase Order"}
        </button>
      </div>

      {/* Purchase Order List Table Section */}
      <PurchaseOrderList />

      {/* Render Store Purchase Modal */}
      <PurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        productsGroupSubgroup={productsGroupSubgroup}
        onSaveStoreProduct={handleSaveStoreProduct}
      />
    </div>
  );
};

export default PurchaseOrder;