import UserTableRow from "./UserTableRow";

const UserManagementTable = ({
  users,
  loading,
  currentUserId,
  actionUserId,
  onAssignRole,
  onToggleActive,
}) => {
  if (loading) {
    return (
      <div className="w-full flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full min-w-[760px] text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 font-bold">#</th>
              <th className="py-3.5 px-4 font-bold">User Info</th>
              <th className="py-3.5 px-4 font-bold">Status &amp; Verification</th>
              <th className="py-3.5 px-4 font-bold">Assign Role</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-14 px-4 text-center text-slate-400 font-medium">
                  No users found matching your filter.
                </td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <UserTableRow
                  key={u._id || idx}
                  user={u}
                  index={idx}
                  currentUserId={currentUserId}
                  isBusy={String(actionUserId) === String(u._id)}
                  onAssignRole={onAssignRole}
                  onToggleActive={onToggleActive}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;