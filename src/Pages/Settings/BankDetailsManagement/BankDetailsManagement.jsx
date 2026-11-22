import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { bankDetailService } from "../../../services/bankDetail/bankDetailService";
import BankDetailsTable from "./BankDetailsTable";
import BankDetailFormModal from "./BankDetailFormModal";

const BankDetailsManagement = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  const loadBanks = async () => {
    try {
      setLoading(true);
      const data = await bankDetailService.getAllBankDetails();
      setBanks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch banks:", error);
      toast.error(error.message || "Failed to load bank details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const filteredBanks = useMemo(() => {
    return banks.filter((bank) => {
      const isActive = bank.isActive !== false;
      if (statusFilter === "active" && !isActive) return false;
      if (statusFilter === "inactive" && isActive) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        bank.bankName?.toLowerCase().includes(q) ||
        bank.accountName?.toLowerCase().includes(q) ||
        bank.accountNo?.toLowerCase().includes(q) ||
        bank.branch?.toLowerCase().includes(q) ||
        bank.details?.toLowerCase().includes(q)
      );
    });
  }, [banks, searchQuery, statusFilter]);

  const activeCount = useMemo(
    () => banks.filter((b) => b.isActive !== false).length,
    [banks]
  );

  const handleOpenCreate = () => {
    setEditingBank(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bank) => {
    setEditingBank(bank);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditingBank(null);
  };

  // Create or Update Bank Detail
  const handleSaveBank = async (payload) => {
    try {
      setSubmitting(true);
      if (editingBank?._id) {
        await bankDetailService.updateBankDetail(editingBank._id, payload);
        toast.success("Bank detail updated successfully!");
      } else {
        await bankDetailService.createBankDetail(payload);
        toast.success("Bank detail created successfully!");
      }

      setIsModalOpen(false);
      setEditingBank(null);
      await loadBanks();
    } catch (error) {
      console.error("Save bank error:", error);
      toast.error(error.message || "Failed to save bank detail");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Bank Detail
  const handleDeleteBank = async (bank) => {
    const confirm = await Swal.fire({
      title: "Delete Bank Account?",
      text: `Are you sure you want to delete "${bank.bankName}" (${bank.accountNo})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(bank._id);
      await bankDetailService.deleteBankDetail(bank._id);
      toast.success("Bank detail deleted successfully!");
      await loadBanks();
    } catch (error) {
      console.error("Delete bank error:", error);
      toast.error(error.message || "Failed to delete bank detail");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col p-4 md:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Page Header */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage bank accounts, branch info, and payment collection details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-100 text-xs">
            <span className="text-slate-500 block font-medium">Total Banks</span>
            <span className="text-base font-extrabold text-sky-700">{banks.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
            <span className="text-slate-500 block font-medium">Active</span>
            <span className="text-base font-extrabold text-emerald-700">{activeCount}</span>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition cursor-pointer"
          >
            + Add Bank
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by account name, account holder name, account no, or branch..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <button
            type="button"
            onClick={loadBanks}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Full-Height / Full-Width Table */}
      <BankDetailsTable
        banks={filteredBanks}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteBank}
        deletingId={deletingId}
      />

      {/* Create / Update Modal */}
      <BankDetailFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBank}
        editingBank={editingBank}
        submitting={submitting}
      />
    </div>
  );
};

export default BankDetailsManagement;