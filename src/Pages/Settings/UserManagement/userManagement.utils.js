export const ASSIGNABLE_ROLES = ["user", "manager", "admin"];

export const filterUsersList = (users, searchQuery, tabFilter) => {
  return users.filter((u) => {
    const status = String(u.status || "pending").toLowerCase();
    const role = String(u.role || "pending").toLowerCase();

    if (tabFilter === "pending" && status !== "pending" && role !== "pending") {
      return false;
    }
    if (tabFilter === "approved" && status !== "approved") {
      return false;
    }
    if (tabFilter === "inactive" && u.isActive !== false) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return [u.name, u.email, u.phone, u.role, u.status].some((v) =>
      String(v || "").toLowerCase().includes(q)
    );
  });
};