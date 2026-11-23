const TABS = [
  { id: "all", label: "All Users" },
  { id: "pending", label: "Pending Requests" },
  { id: "approved", label: "Approved" },
  { id: "inactive", label: "Inactive" },
];

const UserManagementToolbar = ({
  searchQuery,
  onSearchChange,
  tabFilter,
  onTabChange,
  pendingCount,
  onRefresh,
}) => (
  <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              tabFilter === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === "pending" && pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
      >
        Refresh
      </button>
    </div>

    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search by user name, email, phone, or role..."
      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    />
  </div>
);

export default UserManagementToolbar;