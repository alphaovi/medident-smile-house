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
  const boxRef = useRef(null);

  useEffect(() => {
    const close = (e) => boxRef.current && !boxRef.current.contains(e.target) && setDropdown(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filteredUsers = useMemo(() => {
    const q = (dropdown === "email" ? userEmail : userName).trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, userName, userEmail, dropdown]);

  const handleInput = (field, val) => {
    onClearError?.();
    const match = users.find((u) => u[field]?.trim().toLowerCase() === val.trim().toLowerCase());
    if (match) {
      onSelectUser({ userId: match._id, name: match.name, email: match.email });
    } else {
      onSelectUser({
        userId: "",
        name: field === "name" ? val : selectedUserId ? "" : userName,
        email: field === "email" ? val : selectedUserId ? "" : userEmail,
      });
    }
    setDropdown(field);
  };

  const handlePick = (u) => {
    onClearError?.();
    onSelectUser({ userId: u._id, name: u.name || "", email: u.email || "" });
    setDropdown(null);
  };

  const inputClass = isAdmin
    ? "border-slate-300 bg-white text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
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
            readOnly={!isAdmin}
            value={userName}
            autoComplete="off"
            placeholder="Select user name..."
            onFocus={() => isAdmin && setDropdown("name")}
            onChange={(e) => isAdmin && handleInput("name", e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
          />
          {isAdmin && dropdown === "name" && (
            <UserSuggestionDropdown
              items={filteredUsers}
              selectedUserId={selectedUserId}
              primaryKey="name"
              secondaryKey="email"
              emptyText="No matching user found"
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
            readOnly={!isAdmin}
            value={userEmail}
            autoComplete="off"
            placeholder="Select user email..."
            onFocus={() => isAdmin && setDropdown("email")}
            onChange={(e) => isAdmin && handleInput("email", e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${inputClass}`}
          />
          {isAdmin && dropdown === "email" && (
            <UserSuggestionDropdown
              items={filteredUsers}
              selectedUserId={selectedUserId}
              primaryKey="email"
              secondaryKey="name"
              emptyText="No matching email found"
              onSelect={handlePick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BankUserSelectFields;