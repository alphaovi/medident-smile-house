const StockTable = ({ stockData, onPriceChange }) => {
  const calculateCurrentStock = (item) => {
    const totalStock = Number(item.totalStock) || 0;
    const purchaseReturn = Number(item.purchaseReturn) || 0;
    const sellReturn = Number(item.sellReturn) || 0;
    const lostDamage = Number(item.lostDamage || item.lost || item.damaged) || 0;
    const totalSell = Number(item.totalSell) || 0;
    return totalStock - purchaseReturn + sellReturn - lostDamage - totalSell;
  };

  const totalBuyingValue = stockData.reduce((total, item) => {
    const currentStock = calculateCurrentStock(item);
    const averageBuyingPrice = Number(item.avgBuyingPrice ?? item.averageBuyingPrice) || 0;
    
    const stockVal = Number(item.totalStockValue) > 0 && currentStock === 0 
      ? Number(item.totalStockValue) 
      : currentStock * averageBuyingPrice;

    return total + stockVal;
  }, 0);

  const totalSaleValue = stockData.reduce((total, item) => {
    const currentStock = calculateCurrentStock(item);
    // Product ba inventory theke selling price ba total sale value resolve kora
    const sellingPrice = Number(
      item.sellingPrice ?? 
      item.product?.sellingPrice ?? 
      item.product?.price ?? 
      item.totalSaleValue / (currentStock || 1)
    ) || 0;

    const rowSaleVal = Number(item.totalSaleValue) > 0 && currentStock === 0
      ? Number(item.totalSaleValue)
      : currentStock * sellingPrice;

    return total + rowSaleVal;
  }, 0);

  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-3 text-center w-14">SL</th>
              <th className="py-4 px-4 text-left">Product Info</th>
              <th className="py-4 px-3 text-center">Total Stock</th>
              <th className="py-4 px-3 text-center">Purchase Return</th>
              <th className="py-4 px-3 text-center">Sell Return</th>
              <th className="py-4 px-3 text-center">Lost/Damage</th>
              <th className="py-4 px-3 text-center">Total Sell</th>
              <th className="py-4 px-3 text-center">In Transit</th>
              <th className="py-4 px-3 text-center">Current Stock</th>
              <th className="py-4 px-3 text-center">Avg Buying Price</th>
              <th className="py-4 px-3 text-right">Total Stock Value</th>
              <th className="py-4 px-4 text-right">Total Sale Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {stockData.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-8 text-slate-400 font-medium">
                  No stock items found.
                </td>
              </tr>
            ) : (
              stockData.map((item, idx) => {
                const currentStock = calculateCurrentStock(item);
                const averageBuyingPrice = Number(item.avgBuyingPrice ?? item.averageBuyingPrice) || 0;
                
                // Resolve selling price properly from item or product reference
                const sellingPrice = Number(
                  item.sellingPrice ?? 
                  item.product?.sellingPrice ?? 
                  item.product?.price ?? 
                  0
                );
                
                // Row stock value calculation
                const rowBuyingValue = Number(item.totalStockValue) > 0 && currentStock === 0
                  ? Number(item.totalStockValue)
                  : currentStock * averageBuyingPrice;
                
                // Row sale value calculation
                const rowSaleValue = Number(item.totalSaleValue) > 0 && currentStock === 0
                  ? Number(item.totalSaleValue)
                  : currentStock * sellingPrice;

                const onTransitVal = Number(item.onTransit ?? item.transitStock ?? item.inTransit) || 0;
                
                return (
                  <tr 
                    key={item.id || item._id} 
                    className={`transition-colors hover:bg-slate-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                  >
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {item.product?.productName || item.product?.name || item.productName || "N/A"}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                      {Number(item.totalStock) || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center text-orange-600 font-medium">
                      {Number(item.purchaseReturn) || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center text-blue-600 font-medium">
                      {Number(item.sellReturn) || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center text-red-500 font-medium">
                      {Number(item.lostDamage ?? item.damaged ?? item.lost) || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center text-emerald-600 font-medium">
                      {Number(item.totalSell) || 0}
                    </td>
                    <td className="py-3.5 px-3 text-center text-amber-600 font-medium">
                      {onTransitVal}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        currentStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {currentStock}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={averageBuyingPrice.toFixed(2)}
                        onChange={(e) => onPriceChange(item.id || item._id, e.target.value)}
                        className="w-24 px-2.5 py-1.5 text-center text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                      ৳ {rowBuyingValue.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                      ৳ {rowSaleValue.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Grand Totals */}
      <div className="bg-slate-50/75 border-t border-slate-100 p-4 px-6 flex flex-col sm:flex-row justify-end items-end sm:items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grand Total Purchase:</span>
          <span className="text-lg font-bold text-slate-800">৳ {totalBuyingValue.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grand Total Selling:</span>
          <span className="text-lg font-bold text-blue-600">৳ {totalSaleValue.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default StockTable;