import { Eye } from "lucide-react";

const ClientStatementTable = ({ tableData, onViewOrder }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[950px]">
        <thead>
          <tr className="bg-slate-900 text-white text-[13px] font-bold tracking-wider">
            <th className="p-4 pl-6">SL</th>
            <th className="p-4">CUSTOMER / ORDER ID</th>
            <th className="p-4">ORDER DATE</th>
            <th className="p-4">PRODUCTS</th>
            <th className="p-4 text-right">TOTAL BILL</th>
            <th className="p-4 text-right">PAID AMOUNT</th>
            <th className="p-4 text-right">UNPAID (DUE)</th>
            <th className="p-4 text-center">ORDER STATUS</th>
            <th className="p-4 text-center">PAYMENT</th>
            <th className="p-4 text-center pr-6">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          
          {/* Table Data Rows */}
          {tableData.length > 0 ? (
            tableData.map((item, index) => {
              const paid = item.payments && item.payments.length > 0
                ? item.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0)
                : (Number(item.paidAmount) || 0);
              const grandTotal = Number(item.grandTotal) || (paid + (Number(item.dueAmount) || 0));
              const due = Math.max(0, grandTotal - paid);

              // 1. Payment Status Logic
              let payStatus = 'unpaid';
              let payBadge = 'bg-rose-100 text-rose-700';

              if (due <= 0 && grandTotal > 0) {
                payStatus = 'paid';
                payBadge = 'bg-emerald-100 text-emerald-700';
              } else if (paid > 0 && due > 0) {
                payStatus = 'partial';
                payBadge = 'bg-amber-100 text-amber-700';
              }

              // 2. Main Order Status Logic
              const ordStatus = (item.status || 'pending').toLowerCase();
              let ordBadge = 'bg-slate-100 text-slate-700';
              if (ordStatus === 'approved') ordBadge = 'bg-blue-100 text-blue-700';
              if (ordStatus === 'delivered') ordBadge = 'bg-emerald-100 text-emerald-700';
              if (ordStatus === 'pending') ordBadge = 'bg-amber-100 text-amber-700';

              return (
                <tr key={item._id || index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-400">{index + 1}</td>
                  <td className="p-4 font-bold text-slate-900">
                    {item.customer?.name || "Customer"}{" "}
                    <span className="text-xs text-slate-400 font-normal">({item._id?.slice(-6)})</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {item.orderDate ? new Date(item.orderDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="p-4 text-slate-600">{item.products?.length || 0} Items</td>
                  <td className="p-4 text-right font-bold text-slate-800">
                    ৳{grandTotal.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-600">
                    {paid > 0 ? `৳${paid.toLocaleString()}` : '-'}
                  </td>
                  <td className="p-4 text-right font-bold text-rose-600">
                    {due > 0 ? `৳${due.toLocaleString()}` : '-'}
                  </td>
                  
                  {/* Order Status Column */}
                  <td className="p-4 text-center">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${ordBadge}`}>
                      {ordStatus}
                    </span>
                  </td>

                  {/* Payment Status Column */}
                  <td className="p-4 text-center">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${payBadge}`}>
                      {payStatus}
                    </span>
                  </td>

                  <td className="p-4 text-center pr-6">
                    <button
                      onClick={() => onViewOrder(item)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="p-12 text-center text-slate-400 font-medium">
                No statement records found for the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientStatementTable;