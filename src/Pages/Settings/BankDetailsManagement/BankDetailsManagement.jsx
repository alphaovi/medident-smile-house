import { useState, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../../../Contexts/AuthContext";
import { useBankDetailsData } from "../../../components/bankDetails/useBankDetailsData";
import { filterBanksList } from "../../../components/bankDetails/bankDetails.utils";
import BankDetailsHeader from "./BankDetailsHeader";
import BankDetailsToolbar from "./BankDetailsToolbar";
import BankDetailsTable from "./BankDetailsTable";
import BankDetailFormModal from "./BankDetailFormModal";

const BankDetailsManagement = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";
  const { banks, usersList, loading, submitting, deletingId, loadBanks, saveBank, deleteBank } =
    useBankDetailsData(user, isAdmin);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  const filteredBanks = useMemo(
    () => filterBanksList(banks, searchQuery, statusFilter),
    [banks, searchQuery, statusFilter]
  );

  const activeCount = useMemo(
    () => banks.filter((b) => b.isActive !== false).length,
    [banks]
  );

  const handleSave = async (payload) => {
    const ok = await saveBank(payload, editingBank?._id);
    if (ok) {
      setIsModalOpen(false);
      setEditingBank(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col p-4 md:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <BankDetailsHeader
        isAdmin={isAdmin}
        totalCount={banks.length}
        activeCount={activeCount}
        onOpenCreate={() => {
          setEditingBank(null);
          setIsModalOpen(true);
        }}
      />

      <BankDetailsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={loadBanks}
      />

      <BankDetailsTable
        banks={filteredBanks}
        loading={loading}
        isAdmin={isAdmin}
        onEdit={(bank) => {
          setEditingBank(bank);
          setIsModalOpen(true);
        }}
        onDelete={deleteBank}
        deletingId={deletingId}
      />

      <BankDetailFormModal
        isOpen={isModalOpen}
        onClose={() => !submitting && (setIsModalOpen(false), setEditingBank(null))}
        onSave={handleSave}
        editingBank={editingBank}
        submitting={submitting}
        users={usersList}
        currentUser={user}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default BankDetailsManagement;