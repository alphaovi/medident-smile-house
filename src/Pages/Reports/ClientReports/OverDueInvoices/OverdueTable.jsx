import TableRow from './TableRow';

const OverdueTable = ({ reports }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">SL No</th>
              <th className="py-3.5 px-4">Case ID</th>
              <th className="py-3.5 px-4">Clinic Name</th>
              <th className="py-3.5 px-4">Doctor Name</th>
              <th className="py-3.5 px-4">Delivery Date</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Paid Amount</th>
              <th className="py-3.5 px-4">Due Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length > 0 ? (
              reports.map((item, index) => (
                <TableRow key={item.id || index} item={item} index={index} />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-base font-medium text-slate-600">No overdue records found</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters above</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueTable;