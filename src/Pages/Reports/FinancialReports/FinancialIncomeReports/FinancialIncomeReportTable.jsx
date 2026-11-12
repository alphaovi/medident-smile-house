const FinancialIncomeReportTable = ({ reports, totalAmount }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="py-4 px-6">Invoice No</th>
              <th className="py-4 px-6 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {reports.length > 0 ? (
              reports.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-gray-900">
                    {item.invoiceNo}
                  </td>
                  <td className="py-3.5 px-6 text-right font-semibold text-indigo-600">
                    ৳ {item.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-8 text-center text-gray-400">
                  No data found for selected date range
                </td>
              </tr>
            )}
          </tbody>
          {reports.length > 0 && (
            <tfoot>
              <tr className="bg-indigo-50/50 font-bold text-gray-800 border-t border-indigo-100">
                <td className="py-4 px-6">Total Amount</td>
                <td className="py-4 px-6 text-right text-indigo-700 text-base">
                  ৳ {totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default FinancialIncomeReportTable;