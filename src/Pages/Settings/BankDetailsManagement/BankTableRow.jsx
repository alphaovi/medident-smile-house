const BankTableRow = ({ bank, index, isAdmin, onEdit, onDelete, isDeleting }) => {
  const isActive = bank.isActive !== false;

  return (
    <tr className="hover:bg-sky-50/40 transition-colors">
      <td className="py-3.5 px-4 text-slate-500 font-medium">{index + 1}</td>
      {isAdmin && (
        <td className="py-3.5 px-4">
          <div className="font-semibold text-slate-800 text-xs">
            {bank.user?.name || "Unknown User"}
          </div>
          <div className="text-[11px] text-slate-400">{bank.user?.email || ""}</div>
        </td>
      )}
      <td className="py-3.5 px-4 font-bold text-slate-800">{bank.bankName}</td>
      <td className="py-3.5 px-4 text-slate-700 font-medium">{bank.accountName}</td>
      <td className="py-3.5 px-4 font-mono text-slate-800 bg-slate-50/60">
        {bank.accountNo || <span className="text-slate-400">—</span>}
      </td>
      <td className="py-3.5 px-4 text-slate-600">
        {bank.branch || <span className="text-slate-400">—</span>}
      </td>
      <td className="py-3.5 px-4 text-slate-500 max-w-[220px] truncate" title={bank.details}>
        {bank.details || <span className="text-slate-400">—</span>}
      </td>
      <td className="py-3.5 px-4 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(bank)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(bank)}
            disabled={isDeleting}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50 border border-rose-200 transition cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BankTableRow;