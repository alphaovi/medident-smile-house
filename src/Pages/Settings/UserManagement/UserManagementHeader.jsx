const UserManagementHeader = ({ totalCount, pendingCount, activeCount }) => (
  <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
        User &amp; Approval Management
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Approve newly registered accounts, assign roles, and control user access.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
        <span className="text-amber-700 block font-medium">Pending Approval</span>
        <span className="text-base font-extrabold text-amber-800">{pendingCount}</span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
        <span className="text-slate-500 block font-medium">Active Users</span>
        <span className="text-base font-extrabold text-emerald-700">{activeCount}</span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-100 text-xs">
        <span className="text-slate-500 block font-medium">Total Users</span>
        <span className="text-base font-extrabold text-sky-700">{totalCount}</span>
      </div>
    </div>
  </div>
);

export default UserManagementHeader;