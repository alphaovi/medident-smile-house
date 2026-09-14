import React, { useEffect, useState } from "react";
import StockTable from "./StockTable";
import "./StockManagement.css";

const PRINT_ROWS_PER_PAGE = 18;

const StockManagement = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const [storeResponse, productsResponse] = await Promise.all([
          fetch("/store.json"),
          fetch("/products.json"),
        ]);

        if (!storeResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch stock data");
        }

        const storeData = await storeResponse.json();
        const productsData = await productsResponse.json();

        const mergedData = storeData.map((storeItem) => {
          const product = productsData.find(
            (productItem) =>
              String(productItem.productId) === String(storeItem.productId)
          );

          return {
            ...storeItem,
            totalStock: Number(storeItem.totalStock) || 0,
            purchaseReturn: Number(storeItem.purchaseReturn) || 0,
            sellReturn: Number(storeItem.sellReturn) || 0,
            lostDamage: Number(storeItem.lostDamage) || 0,
            totalSell: Number(storeItem.totalSell) || 0,
            averageBuyingPrice: Number(storeItem.averageBuyingPrice) || 0,
            productName: product?.productName || "Unknown Product",
            sellingPrice: Number(product?.unitPrice) || 0,
          };
        });

        setStockData(mergedData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handlePriceChange = (productId, newPrice) => {
    setStockData((prevData) =>
      prevData.map((item) =>
        String(item.productId) === String(productId)
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stock-management">
      <div className="no-print stock-header">
        <div>
          <h2>Store Inventory</h2>
          <p>Manage and view your current stock inventory.</p>
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
                      <tr key={item.productId}>
                        <td >
                          <strong>{item.productName}</strong>
                          <small>{item.productId}</small>
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