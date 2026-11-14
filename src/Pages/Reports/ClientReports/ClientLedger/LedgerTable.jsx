const LedgerTable = ({ ledgerData = [] }) => {
  // 전체 합계 계산
  const totals = ledgerData.reduce(
    (acc, curr) => ({
      sell: acc.sell + curr.sell,
      paid: acc.paid + curr.paid,
      preDue: acc.preDue + curr.preDue,
      returnAmount: acc.returnAmount + curr.returnAmount,
      grandTotal: acc.grandTotal + curr.grandTotal,
    }),
    { sell: 0, paid: 0, preDue: 0, returnAmount: 0, grandTotal: 0 }
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <th className="p-3">Customer ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">SR Name</th>
              <th className="p-3 text-right">Sell (৳)</th>
              <th className="p-3 text-right">Paid (৳)</th>
              <th className="p-3 text-right">Pre Due (৳)</th>
              <th className="p-3 text-right">Return (৳)</th>
              <th className="p-3 text-right">Grand Total (৳)</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-200">
            {ledgerData.length > 0 ? (
              ledgerData.map((item, index) => (
                <tr key={item.customerId || index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium text-slate-700">{item.customId}</td>
                  <td className="p-3 font-bold text-slate-800">{item.customerName}</td>
                  <td className="p-3 text-slate-600">{item.srName}</td>
                  <td className="p-3 text-right text-slate-700">৳{item.sell.toLocaleString()}</td>
                  <td className="p-3 text-right text-emerald-600 font-medium">৳{item.paid.toLocaleString()}</td>
                  <td className="p-3 text-right text-amber-600 font-medium">৳{item.preDue.toLocaleString()}</td>
                  <td className="p-3 text-right text-rose-600 font-medium">৳{item.returnAmount.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-slate-900">৳{item.grandTotal.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-8 text-slate-400">
                  No client ledger data found.
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Footer Total Summary */}
          {ledgerData.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                <td colSpan={3} className="p-3 text-slate-700">Total Summary</td>
                <td className="p-3 text-right text-slate-800">৳{totals.sell.toLocaleString()}</td>
                <td className="p-3 text-right text-emerald-700">৳{totals.paid.toLocaleString()}</td>
                <td className="p-3 text-right text-amber-700">৳{totals.preDue.toLocaleString()}</td>
                <td className="p-3 text-right text-rose-700">৳{totals.returnAmount.toLocaleString()}</td>
                <td className="p-3 text-right text-slate-900">৳{totals.grandTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;