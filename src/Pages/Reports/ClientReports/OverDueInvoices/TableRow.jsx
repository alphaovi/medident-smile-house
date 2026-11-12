const TableRow = ({ item, index }) => {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-sm text-slate-700">
      <td className="py-3.5 px-4 font-medium text-slate-400">{index + 1}</td>
      <td className="py-3.5 px-4 font-semibold text-slate-800">{item.caseNo || item.id}</td>
      <td className="py-3.5 px-4 font-medium text-slate-700">{item.clinicName}</td>
      <td className="py-3.5 px-4 text-slate-600">{item.doctorName}</td>
      <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">{item.deliveryDate}</td>
      <td className="py-3.5 px-4 font-medium text-slate-800">{item.totalAmount.toLocaleString()} BDT</td>
      <td className="py-3.5 px-4 font-medium text-emerald-600">{item.paidAmount.toLocaleString()} BDT</td>
      <td className="py-3.5 px-4 font-bold text-rose-600">
        <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md text-xs border border-rose-100 inline-block">
          {item.dueAmount.toLocaleString()} BDT
        </span>
      </td>
    </tr>
  );
};

export default TableRow;