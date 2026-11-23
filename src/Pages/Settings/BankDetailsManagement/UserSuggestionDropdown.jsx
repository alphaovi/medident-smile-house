const UserSuggestionDropdown = ({
  items,
  selectedUserId,
  searchTerm,
  onSearchChange,
  primaryKey,
  secondaryKey,
  emptyText,
  onSelect,
}) => (
  <div className="absolute z-30 mt-1 w-full rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden">
    <div className="p-2 bg-slate-50 border-b border-slate-200">
      <input
        type="text"
        autoFocus
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search approved user..."
        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
      />
    </div>

    <ul className="max-h-44 overflow-y-auto divide-y divide-slate-100 text-xs">
      {items.length === 0 ? (
        <li className="px-3 py-2.5 text-slate-400">{emptyText}</li>
      ) : (
        items.map((u) => (
          <li
            key={u._id}
            onMouseDown={() => onSelect(u)}
            className={`px-3 py-2 cursor-pointer hover:bg-sky-50 transition ${
              String(selectedUserId) === String(u._id) ? "bg-sky-50/80" : ""
            }`}
          >
            <div className="font-bold text-slate-800">{u[primaryKey]}</div>
            <div className="text-[11px] text-slate-500">{u[secondaryKey]}</div>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default UserSuggestionDropdown;