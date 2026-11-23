import { useState } from "react";
import { ASSIGNABLE_ROLES } from "./userManagement.utils";
import UserStatusBadges from "./UserStatusBadges";

const UserTableRow = ({ user, index, currentUserId, isBusy, onAssignRole, onToggleActive }) => {
  const isSelf = String(user._id) === String(currentUserId);
  const initialRole = ASSIGNABLE_ROLES.includes(user.role) ? user.role : "user";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const isPending = user.status === "pending" || user.role === "pending";

  return (
    <tr className="hover:bg-indigo-50/30 transition-colors">
      <td className="py-3.5 px-4 text-slate-500 font-medium">{index + 1}</td>

      <td className="py-3.5 px-4">
        <div className="font-bold text-slate-800">{user.name || "Unnamed"}</div>
        <div className="text-xs text-slate-500">{user.email}</div>
        {user.phone && <div className="text-[11px] text-slate-400">{user.phone}</div>}
      </td>

      <td className="py-3.5 px-4">
        <UserStatusBadges user={user} />
      </td>

      <td className="py-3.5 px-4">
        <select
          value={selectedRole}
          disabled={isBusy || isSelf}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 uppercase focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        >
          {ASSIGNABLE_ROLES.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>
      </td>

      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            disabled={isBusy || isSelf}
            onClick={() => onAssignRole(user._id, selectedRole)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition cursor-pointer"
          >
            {isBusy ? "Saving..." : isPending ? "Approve & Assign" : "Update Role"}
          </button>

          {!isPending && (
            <button
              type="button"
              disabled={isBusy || isSelf}
              onClick={() => onToggleActive(user)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50 transition cursor-pointer ${
                user.isActive
                  ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;