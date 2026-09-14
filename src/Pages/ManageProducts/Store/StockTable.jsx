import React from "react";
import "./StockTable.css";

const StockTable = ({ stockData, onPriceChange }) => {
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

  return (
    <div className="stock-table-wrapper">
      <table className="stock-table">
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
          {stockData.map((item) => {
            const currentStock = calculateCurrentStock(item);
            const averageBuyingPrice = Number(item.averageBuyingPrice) || 0;
            const sellingPrice = Number(item.sellingPrice) || 0;
            const rowBuyingValue = currentStock * averageBuyingPrice;
            const rowSaleValue = currentStock * sellingPrice;
            return (
              <tr key={item.productId}>
                <td>
                  <div className="product-info">
                    <strong>{item.productName}</strong>
                    <span>{item.productId}</span>
                  </div>
                </td>
                <td>{Number(item.totalStock) || 0}</td>
                <td>{Number(item.purchaseReturn) || 0}</td>
                <td>{Number(item.sellReturn) || 0}</td>
                <td>{Number(item.lostDamage) || 0}</td>
                <td>{Number(item.totalSell) || 0}</td>
                <td>
                  <strong>{currentStock}</strong>
                </td>
                <td>
                  <input
                    type="number"
                    value={averageBuyingPrice}
                    onChange={(e) =>
                      onPriceChange(item.productId, e.target.value)
                    }
                  />
                </td>
                <td>{rowBuyingValue.toLocaleString("en-BD")}</td>
                <td>{rowSaleValue.toLocaleString("en-BD")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="grand-total">
        <div>
          <span>Grand Total Purchase Price</span>
          <strong>{totalBuyingValue.toLocaleString("en-BD")}</strong>
        </div>
        <div>
          <span>Grand Total Selling Price</span>
          <strong>{totalSaleValue.toLocaleString("en-BD")}</strong>
        </div>
      </div>
    </div>
  );
};

export default StockTable;