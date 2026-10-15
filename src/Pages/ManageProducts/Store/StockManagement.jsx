import { useState, useEffect } from "react";
import StockTable from "./StockTable"; // Apnar table component
import { useInventoryManagementService } from "../../../services/useInventoryManagementService"; // Path thik rakhen
import { toast } from "react-toastify";

const StockManagement = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllInventories } = useInventoryManagementService();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getAllInventories();
      console.log("Fetched Inventory Data:", data); // Browser console-e check korar jonno
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

  const handlePriceChange = (id, newPrice) => {
    setStockData((prev) =>
      prev.map((item) =>
        item.id === id || item._id === id
          ? { ...item, avgBuyingPrice: Number(newPrice) }
          : item,
      ),
    );
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
