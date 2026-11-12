const FinancialExpenseTable = ({ reports, totalAmount, selectedGroup }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Table Header Info */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Expense Breakdown
        </span>
        <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full">
          Total Entries: {reports.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Invoice No</th>
              
              {/* Group সিলেক্ট থাকলে হেডার হবে Sub Group, না থাকলে Group */}
              <th className="py-4 px-6">
                {selectedGroup ? 'Sub Group' : 'Group'}
              </th>

              <th className="py-4 px-6 text-right">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
            {reports.length > 0 ? (
              reports.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {item.invoiceNo}
                  </td>

                  {/* Group সিলেক্ট থাকলে ডাটা দেখাবে subGroup, না থাকলে group */}
                  <td className="py-4 px-6 text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {selectedGroup ? item.subGroup : item.group}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-bold text-rose-600">
                    ৳ {item.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-slate-400 font-normal"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>No expense records found matching the criteria</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

          {reports.length > 0 && (
            <tfoot>
              <tr className="bg-gradient-to-r from-rose-50/40 via-rose-50/70 to-rose-50/40 font-bold border-t border-rose-100">
                <td colSpan={2} className="py-4 px-6 text-slate-700 uppercase text-xs tracking-wider">
                  Total Expense
                </td>
                <td className="py-4 px-6 text-right text-rose-600 text-base font-extrabold">
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

export default FinancialExpenseTable;