const BankDetailsHeader = ({ isAdmin, totalCount, activeCount, onOpenCreate }) => (
  <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
        Manage Accounts
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        {isAdmin
          ? "Admin view: Manage all users' bank accounts and payment details."
          : "Manage your personal bank accounts and payment collection details."}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <div className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-100 text-xs">
        <span className="text-slate-500 block font-medium">Total Banks</span>
        <span className="text-base font-extrabold text-sky-700">{totalCount}</span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
        <span className="text-slate-500 block font-medium">Active</span>
        <span className="text-base font-extrabold text-emerald-700">{activeCount}</span>
      </div>
      <button
        type="button"
        onClick={onOpenCreate}
        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition cursor-pointer"
      >
        + Add Bank
      </button>
    </div>
  </div>
);

export default BankDetailsHeader;