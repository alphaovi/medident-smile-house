import { useEffect, useState } from "react";
import StockTable from "./StockTable";
import { useInventoryManagementService } from "../../../services/useInventoryManagementService";
import { Package, Printer, AlertCircle, Loader2, TrendingUp, Layers } from "lucide-react";

const PRINT_ROWS_PER_PAGE = 16;

const StockManagement = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { getAllInventories } = useInventoryManagementService();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const response = await getAllInventories();

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch stock data");
        }

        const formattedData = response.data.map((item, index) => {
          const productObj = item.product;
          
          let productName = "General Stock Item";
          let sellingPrice = 0;

          if (productObj && typeof productObj === "object") {
            productName = productObj.name || productObj.productName || productObj.title || `Product (${String(productObj._id || "").slice(-6)})`;
            sellingPrice = Number(productObj.sellingPrice || productObj.unitPrice || 0);
          } else if (typeof productObj === "string") {
            productName = `Product ID: ${productObj.slice(-6)}`;
          } else {
            productName = `Inventory Item #${index + 1}`;
          }

          return {
            id: item._id || index,
            productName: productName,
            sellingPrice: sellingPrice,
            totalStock: Number(item.totalStock) || 0,
            purchaseReturn: Number(item.purchaseReturn) || 0,
            sellReturn: Number(item.sellReturn) || 0,
            lostDamage: Number((item.lost || 0) + (item.damaged || 0)) || 0,
            totalSell: Number(item.totalSell) || 0,
            averageBuyingPrice: Number(item.avgBuyingPrice) || 0,
          };
        });

        setStockData(formattedData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handlePriceChange = (id, newPrice) => {
    setStockData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, averageBuyingPrice: Number(newPrice) || 0 }
          : item
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateCurrentStock = (item) => {
    const totalStock = Number(item.totalStock) || 0;
    const purchaseReturn = Number(item.purchaseReturn) || 0;
    const sellReturn = Number(item.sellReturn) || 0;
    const lostDamage = Number(item.lostDamage) || 0;
    const totalSell = Number(item.totalSell) || 0;
    return totalStock - purchaseReturn + sellReturn - lostDamage - totalSell;
  };

  const filteredStockData = stockData.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBuyingValue = stockData.reduce((total, item) => {
    const currentStock = calculateCurrentStock(item);
    const averageBuyingPrice = Number(item.averageBuyingPrice) || 0;
    return total + currentStock * averageBuyingPrice;
  }, 0);

  const totalSaleValue = stockData.reduce((total, item) => {
    const currentStock = calculateCurrentStock(item);
    const sellingPrice = Number(item.sellingPrice) || 0;
    return total + currentStock * sellingPrice;
  }, 0);

  const printPages = [];
  for (let i = 0; i < stockData.length; i += PRINT_ROWS_PER_PAGE) {
    printPages.push(stockData.slice(i, i + PRINT_ROWS_PER_PAGE));
  }

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading inventory from server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 m-6 text-red-700 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="no-print flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Store Inventory</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage and view your current stock inventory from live backend.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
          />
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Grand Total Purchase Price</p>
            <h3 className="text-2xl font-bold mt-1">৳ {totalBuyingValue.toLocaleString("en-BD")}</h3>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <Layers className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Grand Total Selling Price</p>
            <h3 className="text-2xl font-bold mt-1">৳ {totalSaleValue.toLocaleString("en-BD")}</h3>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Main Stock Table Component */}
      <div className="no-print bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <StockTable
          stockData={filteredStockData}
          onPriceChange={handlePriceChange}
        />
      </div>

      {/* Professional Print Layout Template */}
      <div className="print-version hidden">
        {printPages.map((pageData, pageIndex) => {
          const isLastPage = pageIndex === printPages.length - 1;
          return (
            <div className="print-page" key={pageIndex}>
              {/* Print Header */}
              <div className="print-header">
                <div className="print-company-info">
                  <h2>STORE INVENTORY REPORT</h2>
                  <p>Comprehensive Stock Valuation & Status Statement</p>
                </div>
                <div className="print-meta">
                  <span><strong>Date:</strong> {currentDate}</span>
                  <span><strong>Page:</strong> {pageIndex + 1} of {printPages.length}</span>
                </div>
              </div>

              {/* Print Table */}
              <table className="print-stock-table">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th>Product Info</th>
                    <th>Total Stock</th>
                    <th>Purchase Return</th>
                    <th>Sell Return</th>
                    <th>Lost/Damage</th>
                    <th>Total Sell</th>
                    <th>Current Stock</th>
                    <th>Avg Buying Price (৳)</th>
                    <th>Total Stock Value (৳)</th>
                    <th>Total Sale Value (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((item, index) => {
                    const globalIndex = pageIndex * PRINT_ROWS_PER_PAGE + index + 1;
                    const currentStock = calculateCurrentStock(item);
                    const averageBuyingPrice = Number(item.averageBuyingPrice) || 0;
                    const sellingPrice = Number(item.sellingPrice) || 0;
                    const rowBuyingValue = currentStock * averageBuyingPrice;
                    const rowSaleValue = currentStock * sellingPrice;
                    return (
                      <tr key={item.id}>
                        <td className="text-center font-medium">{globalIndex}</td>
                        <td className="text-left font-semibold">{item.productName}</td>
                        <td className="text-center">{Number(item.totalStock) || 0}</td>
                        <td className="text-center">{Number(item.purchaseReturn) || 0}</td>
                        <td className="text-center">{Number(item.sellReturn) || 0}</td>
                        <td className="text-center">{Number(item.lostDamage) || 0}</td>
                        <td className="text-center">{Number(item.totalSell) || 0}</td>
                        <td className="text-center font-bold">{currentStock}</td>
                        <td className="text-right">{averageBuyingPrice.toLocaleString("en-BD")}</td>
                        <td className="text-right">{rowBuyingValue.toLocaleString("en-BD")}</td>
                        <td className="text-right font-semibold">{rowSaleValue.toLocaleString("en-BD")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Grand Totals (Only on Last Page) */}
              {isLastPage && (
                <div className="print-grand-total-box">
                  <div className="print-total-item">
                    <span>Grand Total Purchase Price:</span>
                    <strong>৳ {totalBuyingValue.toLocaleString("en-BD")}</strong>
                  </div>
                  <div className="print-total-item">
                    <span>Grand Total Selling Price:</span>
                    <strong>৳ {totalSaleValue.toLocaleString("en-BD")}</strong>
                  </div>
                </div>
              )}

              {/* Footer Signature Note */}
              <div className="print-footer-signature">
                <div className="signature-line">Authorized Signature</div>
                <div className="print-system-info">Generated from Live Inventory System</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockManagement;