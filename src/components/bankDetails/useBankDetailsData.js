import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AuthService } from "../../services/auth/auth.service";
import { bankDetailService } from "../../services/bankDetail/bankDetailService";

export const useBankDetailsData = (user, isAdmin) => {
  const [banks, setBanks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadBanks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bankDetailService.getAllBankDetails();
      setBanks(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load bank details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  useEffect(() => {
    if (!isAdmin) {
      setUsersList(user ? [user] : []);
      return;
    }
    AuthService.getAllUsers()
      .then((res) => setUsersList(Array.isArray(res) ? res : res?.users || res?.data || []))
      .catch(() => setUsersList(user ? [user] : []));
  }, [isAdmin, user]);

  const saveBank = async (payload, editingId) => {
    try {
      setSubmitting(true);
      if (editingId) {
        await bankDetailService.updateBankDetail(editingId, payload);
        toast.success("Bank detail updated successfully!");
      } else {
        await bankDetailService.createBankDetail(payload);
        toast.success("Bank detail created successfully!");
      }
      await loadBanks();
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to save bank detail");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBank = async (bank) => {
    const confirm = await Swal.fire({
      title: "Delete Bank Account?",
      text: `Delete "${bank.bankName}" (${bank.accountNo || "Cash"})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(bank._id);
      await bankDetailService.deleteBankDetail(bank._id);
      toast.success("Bank detail deleted successfully!");
      await loadBanks();
    } catch (error) {
      toast.error(error.message || "Failed to delete bank detail");
    } finally {
      setDeletingId(null);
    }
  };

  return { banks, usersList, loading, submitting, deletingId, loadBanks, saveBank, deleteBank };
};