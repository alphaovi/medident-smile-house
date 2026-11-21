const BankDetailsTable = ({
  banks = [],
  loading = false,
  onEdit,
  onDelete,
  deletingId = null,
}) => {
  if (loading) {
    return (
      <div className="w-full flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading bank details...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full min-w-[780px] text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 font-bold">#</th>
              <th className="py-3.5 px-4 font-bold">Bank Name</th>
              <th className="py-3.5 px-4 font-bold">Account Name</th>
              <th className="py-3.5 px-4 font-bold">Account No</th>
              <th className="py-3.5 px-4 font-bold">Branch</th>
              <th className="py-3.5 px-4 font-bold">Details</th>
              <th className="py-3.5 px-4 font-bold text-center">Status</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {banks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 px-4 text-center text-slate-400 font-medium">
                  No bank details found. Click &ldquo;+ Add Bank&rdquo; to create one.
                </td>
              </tr>
            ) : (
              banks.map((bank, index) => {
                const isActive = bank.isActive !== false;
                const isDeleting = String(deletingId) === String(bank._id);

                return (
                  <tr
                    key={bank._id || index}
                    className="hover:bg-sky-50/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {bank.bankName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {bank.accountName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 bg-slate-50/60">
                      {bank.accountNo}
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
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetailsTable;