import { useState, useMemo } from "react";
import { Navigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../../../Contexts/AuthContext";
import { useUserManagement } from "./useUserManagement";

import UserManagementHeader from "./UserManagementHeader";
import UserManagementToolbar from "./UserManagementToolbar";
import UserManagementTable from "./UserManagementTable";
import { filterUsersList } from "./userManagement.utils";

const UserManagement = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";
  const { users, loading, actionUserId, loadUsers, handleAssignRole, handleToggleActive } =
    useUserManagement();

  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState("pending");

  const pendingCount = useMemo(
    () => users.filter((u) => u.status === "pending" || u.role === "pending").length,
    [users]
  );

  const activeCount = useMemo(() => users.filter((u) => u.isActive).length, [users]);

  const filteredUsers = useMemo(
    () => filterUsersList(users, searchQuery, tabFilter),
    [users, searchQuery, tabFilter]
  );

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col p-4 md:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <UserManagementHeader
        totalCount={users.length}
        pendingCount={pendingCount}
        activeCount={activeCount}
      />

      <UserManagementToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tabFilter={tabFilter}
        onTabChange={setTabFilter}
        pendingCount={pendingCount}
        onRefresh={loadUsers}
      />

      <UserManagementTable
        users={filteredUsers}
        loading={loading}
        currentUserId={user?._id}
        actionUserId={actionUserId}
        onAssignRole={handleAssignRole}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
};

export default UserManagement;