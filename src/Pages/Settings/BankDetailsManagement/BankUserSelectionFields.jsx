import { useState, useMemo, useRef, useEffect } from "react";
import UserSuggestionDropdown from "./UserSuggestionDropdown";

const BankUserSelectFields = ({
  users = [],
  isAdmin = false,
  selectedUserId = "",
  userName = "",
  userEmail = "",
  onSelectUser,
  onClearError,
}) => {
  const [dropdown, setDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setDropdown(null);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const approvedActiveUsers = useMemo(() => {
    return users.filter((u) => {
      const isPending =
        String(u.status || "").toLowerCase() === "pending" ||
        String(u.role || "").toLowerCase() === "pending";
      return !isPending && u.isActive !== false;
    });
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return approvedActiveUsers;
    return approvedActiveUsers.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [approvedActiveUsers, searchTerm]);

  const openDropdown = (field) => {
    if (!isAdmin) return;
    setSearchTerm("");
    setDropdown(field);
  };

  const handlePick = (u) => {
    onClearError?.();
    onSelectUser({ userId: u._id, name: u.name || "", email: u.email || "" });
    setDropdown(null);
    setSearchTerm("");
  };

  const inputClass = isAdmin
    ? "border-slate-300 bg-white text-slate-800 cursor-pointer focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
    : "border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed";

  return (
    <div ref={boxRef} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Account Owner Information
        </span>
        {selectedUserId && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            User Matched
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            User Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            readOnly
            value={userName}
            placeholder="Select user name..."
            onClick={() => openDropdown("name")}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
          />
          {isAdmin && dropdown === "name" && (
            <UserSuggestionDropdown
              items={filteredUsers}
              selectedUserId={selectedUserId}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              primaryKey="name"
              secondaryKey="email"
              emptyText="No active approved user found"
              onSelect={handlePick}
            />
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            User Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            readOnly
            value={userEmail}
            placeholder="Select user email..."
            onClick={() => openDropdown("email")}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
          />
          {isAdmin && dropdown === "email" && (
            <UserSuggestionDropdown
              items={filteredUsers}
              selectedUserId={selectedUserId}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              primaryKey="email"
              secondaryKey="name"
              emptyText="No active approved email found"
              onSelect={handlePick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BankUserSelectFields;