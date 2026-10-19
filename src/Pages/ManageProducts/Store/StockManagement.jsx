import { useState, useEffect } from "react";
import StockTable from "./StockTable"; 
import { useInventoryManagementService } from "../../../services/useInventoryManagementService"; 
import { toast } from "react-toastify";

const StockManagement = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllInventories, updateInventoryPrice } = useInventoryManagementService();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getAllInventories();
      setStockData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error(error.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handlePriceChange = async (id, newPrice) => {
    const numericPrice = Number(newPrice);
    
    try {
      // Find the specific item in stockData using any ID variations
      const targetItem = stockData.find(
        (item) => item._id === id || item.id === id || item.product?._id === id || item.product === id
      );

      // Prioritize inventory document _id, if not found use product reference id, finally fallback to passed id
      const inventoryId = targetItem?._id || targetItem?.id || targetItem?.product?._id || targetItem?.product || id;

      if (inventoryId) {
        await updateInventoryPrice(inventoryId, { avgBuyingPrice: numericPrice });
        toast.success("Average buying price updated successfully!");
        
        // Update local state immediately
        setStockData((prev) =>
          prev.map((item) =>
            (item._id === inventoryId || item.id === inventoryId || item.product?._id === inventoryId || item.product === inventoryId)
              ? { ...item, avgBuyingPrice: numericPrice }
              : item
          )
        );
      } else {
        toast.error("Inventory ID not found for update");
      }
    } catch (error) {
      console.error("Update price error:", error);
      toast.error(error.message || "Failed to update price in database");
      fetchInventory(); // Rollback/refetch on error
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Store Inventory
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Manage and view your current stock inventory from live backend.
          </p>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
            <p className="mt-2 text-sm text-base-content/60">
              Loading inventory stock...
            </p>
          </div>
        ) : (
          <StockTable stockData={stockData} onPriceChange={handlePriceChange} />
        )}
      </div>
    </div>
  );
};

export default StockManagement;