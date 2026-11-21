// components/AssetListTable.jsx


const AssetListTable = ({ assets, onStatusChange, onEditClick }) => {
  
  // Dynamic Badge Color Scheme
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "Hold":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Bought":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "Sold":
        return "bg-rose-100 text-rose-700 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  // Direct Browser Window Print Function
  const handlePrint = (asset) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Asset Receipt - ${asset.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
            .card { border: 1px solid #cbd5e1; padding: 24px; border-radius: 12px; max-width: 450px; margin: auto; }
            h2 { border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-top: 0; color: #0f172a; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .label { font-weight: 600; color: #64748b; }
            .val { font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Asset Voucher</h2>
            <div class="row"><span class="label">Asset ID:</span> <span class="val">${asset.id}</span></div>
            <div class="row"><span class="label">Date:</span> <span class="val">${asset.date}</span></div>
            <div class="row"><span class="label">Category:</span> <span class="val">${asset.assetHead} (${asset.assetSubHead})</span></div>
            <div class="row"><span class="label">Payment Account:</span> <span class="val">${asset.paymentMethod}</span></div>
            <div class="row"><span class="label">Amount:</span> <span class="val">৳${asset.amount}</span></div>
            <div class="row"><span class="label">Status:</span> <span class="val">${asset.status}</span></div>
            <div class="row"><span class="label">Note:</span> <span class="val">${asset.note || "N/A"}</span></div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-4">ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Head / Sub-Head</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Note</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-700">
            {assets.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-8 text-slate-400 font-normal">
                  No assets found matching your criteria.
                </td>
              </tr>
            ) : (
              assets.map((item) => {
                // Bought or Sold হলে ড্রপডাউন লক হয়ে যাবে
                const isLocked = item.status === "Bought" || item.status === "Sold";

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{item.id}</td>
                    <td className="p-4 whitespace-nowrap">{item.date}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{item.assetHead}</div>
                      <div className="text-xs text-slate-400">{item.assetSubHead}</div>
                    </td>
                    <td className="p-4">{item.paymentMethod}</td>
                    <td className="p-4 font-bold text-slate-900">৳{item.amount}</td>
                    <td className="p-4 max-w-xs truncate text-slate-500" title={item.note}>
                      {item.note || "-"}
                    </td>

                    {/* Dynamic Locked Dropdown Status */}
                    <td className="p-4">
                      {isLocked ? (
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          ✓ {item.status}
                        </span>
                      ) : (
                        <select
                          value={item.status}
                          onChange={(e) => onStatusChange(item.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Hold">Hold</option>
                          <option value="Bought">Approve (Buy)</option>
                          <option value="Sold">Approve (Sell)</option>
                        </select>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEditClick(item)}
                          className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePrint(item)}
                          className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetListTable;