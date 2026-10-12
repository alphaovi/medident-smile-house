import { useEffect, useState } from "react";
import StockTable from "./StockTable";
import { useInventoryManagementService } from "../../../services/useInventoryManagementService";
import "./StockManagement.css";

const PRINT_ROWS_PER_PAGE = 18;

const StockManagement = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getAllInventories } = useInventoryManagementService();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const response = await getAllInventories();

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch stock data");
        }

        // Mapping backend response data safely with robust fallbacks
        const formattedData = response.data.map((item, index) => {
          const productObj = item.product;
          
          let productName = "General Stock Item";
          let sellingPrice = 0;

          // Check if product is successfully populated as an object
          if (productObj && typeof productObj === "object") {
            productName = productObj.name || productObj.productName || productObj.title || `Product (${String(productObj._id || "").slice(-6)})`;
            sellingPrice = Number(productObj.sellingPrice || productObj.unitPrice || 0);
          } else if (typeof productObj === "string") {
            // If product is just an unpopulated ID string
            productName = `Product ID: ${productObj.slice(-6)}`;
          } else {
            // Fallback if product field is missing or null
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

  if (loading) {
    return <div>Loading inventory from server...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="stock-management">
      <div className="no-print stock-header">
        <div>
          <h2>Store Inventory</h2>
          <p>Manage and view your current stock inventory from live backend.</p>
        </div>
        <button className="print-report-btn" onClick={handlePrint}>
          Print Report
        </button>
      </div>

      <div className="no-print">
        <StockTable
          stockData={stockData}
          onPriceChange={handlePriceChange}
        />
      </div>

      <div className="print-version">
        {printPages.map((pageData, pageIndex) => {
          const isLastPage = pageIndex === printPages.length - 1;
          return (
            <div className="print-page" key={pageIndex}>
              <div className="print-header">
                <div>
                  <h1>Store Inventory Report</h1>
                  <p>Stock Management Report</p>
                </div>
              </div>
              <table className="print-stock-table">
                <thead>
                  <tr>
                    <th>Product Info</th>
                    <th>Total Stock</th>
                    <th>Purchase Return</th>
                    <th>Sell Return</th>
                    <th>Lost/Damage</th>
                    <th>Total Sell</th>
                    <th>Current Stock</th>
                    <th>Avg Buying Price</th>
                    <th>Total Stock Value</th>
                    <th>Total Sale Value</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((item) => {
                    const currentStock = calculateCurrentStock(item);
                    const averageBuyingPrice = Number(item.averageBuyingPrice) || 0;
                    const sellingPrice = Number(item.sellingPrice) || 0;
                    const rowBuyingValue = currentStock * averageBuyingPrice;
                    const rowSaleValue = currentStock * sellingPrice;
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.productName}</strong>
                        </td>
                        <td>{Number(item.totalStock) || 0}</td>
                        <td>{Number(item.purchaseReturn) || 0}</td>
                        <td>{Number(item.sellReturn) || 0}</td>
                        <td>{Number(item.lostDamage) || 0}</td>
                        <td>{Number(item.totalSell) || 0}</td>
                        <td>
                          <strong>{currentStock}</strong>
                        </td>
                        <td>{averageBuyingPrice.toLocaleString("en-BD")}</td>
                        <td>{rowBuyingValue.toLocaleString("en-BD")}</td>
                        <td>{rowSaleValue.toLocaleString("en-BD")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {isLastPage && (
                <div className="print-grand-total">
                  <div>
                    <span>Grand Total Purchase Price</span>
                    <strong>{totalBuyingValue.toLocaleString("en-BD")}</strong>
                  </div>
                  <div>
                    <span>Grand Total Selling Price</span>
                    <strong>{totalSaleValue.toLocaleString("en-BD")}</strong>
                  </div>
                </div>
              )}

              <div className="manual-page-number">
                Page {pageIndex + 1} of {printPages.length}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockManagement;