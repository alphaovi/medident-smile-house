const UserStatusBadges = ({ user }) => {
  const isPending = user.status === "pending" || user.role === "pending";

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
          isPending
            ? "bg-amber-100 text-amber-800"
            : user.isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {isPending ? "Pending Approval" : user.isActive ? "Approved & Active" : "Deactivated"}
      </span>

      <span
        className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-medium ${
          user.isEmailVerified
            ? "bg-sky-50 text-sky-700 border border-sky-200"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {user.isEmailVerified ? "Email Verified" : "Email Unverified"}
      </span>
    </div>
  );
};

export default UserStatusBadges;