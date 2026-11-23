import BankTableRow from "./BankTableRow";

const BankDetailsTable = ({
  banks = [],
  loading = false,
  isAdmin = false,
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
              {isAdmin && <th className="py-3.5 px-4 font-bold">Owner</th>}
              <th className="py-3.5 px-4 font-bold">Account Name</th>
              <th className="py-3.5 px-4 font-bold">Account Holder</th>
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
                <td colSpan={isAdmin ? 9 : 8} className="py-14 px-4 text-center text-slate-400 font-medium">
                  No bank details found. Click &ldquo;+ Add Bank&rdquo; to create one.
                </td>
              </tr>
            ) : (
              banks.map((bank, index) => (
                <BankTableRow
                  key={bank._id || index}
                  bank={bank}
                  index={index}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={String(deletingId) === String(bank._id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetailsTable;