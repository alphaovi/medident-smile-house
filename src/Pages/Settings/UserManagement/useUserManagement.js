import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { AuthService } from "../../../services/auth/auth.service";

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AuthService.getAllUsers();
      const list = Array.isArray(res) ? res : res?.users || res?.data || [];
      setUsers(list);
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAssignRole = async (userId, role) => {
    try {
      setActionUserId(userId);
      await AuthService.approveAndAssignRole(userId, role);
      toast.success(`User approved and assigned "${role}" role!`);
      await loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to assign role");
    } finally {
      setActionUserId(null);
    }
  };

  const handleToggleActive = async (targetUser) => {
    try {
      setActionUserId(targetUser._id);
      const nextState = !targetUser.isActive;
      await AuthService.updateUserActiveStatus(targetUser._id, nextState);
      toast.success(nextState ? "User activated!" : "User deactivated!");
      await loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    } finally {
      setActionUserId(null);
    }
  };

  return { users, loading, actionUserId, loadUsers, handleAssignRole, handleToggleActive };
};