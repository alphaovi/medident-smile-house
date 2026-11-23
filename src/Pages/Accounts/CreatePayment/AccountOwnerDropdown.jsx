import { useState, useRef, useEffect } from "react";

const AccountOwnerDropdown = ({ usersList = [], selectedOwnerId, onSelectOwner }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedOwner = usersList.find((u) => String(u._id) === String(selectedOwnerId));

  const filteredOwners = usersList.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative" ref={boxRef}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        Select Account Owner
      </label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-sky-400 focus:outline-none focus:border-sky-500 flex items-center justify-between gap-2"
      >
        {selectedOwner ? (
          <div className="truncate">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {selectedOwner.name}
            </div>
            <div className="text-[11px] text-gray-500 truncate">{selectedOwner.email}</div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Select User...</span>
        )}
        <svg
          className="w-4 h-4 text-gray-500 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-1.5 bg-gray-50 border-b border-gray-200">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-sky-500"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto divide-y divide-gray-100">
            {filteredOwners.length === 0 ? (
              <li className="px-3 py-2 text-xs text-gray-400">No user found</li>
            ) : (
              filteredOwners.map((u) => (
                <li
                  key={u._id}
                  onClick={() => {
                    onSelectOwner(u._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-sky-50 transition ${
                    String(selectedOwnerId) === String(u._id) ? "bg-sky-50/80" : ""
                  }`}
                >
                  <div className="text-xs font-bold text-gray-800">{u.name}</div>
                  <div className="text-[11px] text-gray-500">{u.email}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountOwnerDropdown;