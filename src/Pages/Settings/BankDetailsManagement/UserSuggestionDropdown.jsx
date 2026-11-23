const UserSuggestionDropdown = ({ items, selectedUserId, primaryKey, secondaryKey, emptyText, onSelect }) => (
  <ul className="absolute z-30 mt-1 w-full max-h-48 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-lg divide-y divide-slate-100 text-xs">
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
);

export default UserSuggestionDropdown;