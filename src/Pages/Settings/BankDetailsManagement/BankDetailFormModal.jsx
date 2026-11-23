import { useState, useEffect } from "react";
import { INITIAL_BANK_FORM, validateBankFormData } from "../../../components/bankDetails/bankDetails.utils";
import BankModalHeader from "./BankModalHeader";
import BankUserSelectFields from "./BankUserSelectionFields";
import BankFormInputs from "./BankFormInputs";
import BankModalFooter from "./BankModalFooter";

const BankDetailFormModal = ({
  isOpen,
  onClose,
  onSave,
  editingBank = null,
  submitting = false,
  users = [],
  currentUser = null,
  isAdmin = false,
}) => {
  const [formData, setFormData] = useState(INITIAL_BANK_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    if (!isOpen) return;

    if (editingBank) {
      const owner =
        typeof editingBank.user === "object" && editingBank.user !== null
          ? editingBank.user
          : users.find((u) => String(u._id) === String(editingBank.user)) || {};

      setFormData({
        userId: owner._id || (typeof editingBank.user === "string" ? editingBank.user : ""),
        userName: owner.name || currentUser?.name || "",
        userEmail: owner.email || currentUser?.email || "",
        bankName: editingBank.bankName || "",
        accountNo: editingBank.accountNo || "",
        accountName: editingBank.accountName || owner.name || "",
        branch: editingBank.branch || "",
        details: editingBank.details || "",
        isActive: editingBank.isActive !== undefined ? Boolean(editingBank.isActive) : true,
      });
    } else {
      const defaultName = currentUser?.name || "";
      setFormData({
        ...INITIAL_BANK_FORM,
        userId: currentUser?._id || "",
        userName: defaultName,
        userEmail: currentUser?.email || "",
        accountName: defaultName,
      });
    }
  }, [editingBank, isOpen, currentUser, users]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationMsg = validateBankFormData(formData, isAdmin);
    if (validationMsg) return setError(validationMsg);

    onSave({
      ...(formData.userId ? { user: formData.userId } : {}),
      bankName: formData.bankName.trim(),
      accountNo: formData.accountNo.trim(),
      accountName: formData.accountName.trim(),
      branch: formData.branch.trim(),
      details: formData.details.trim(),
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        <BankModalHeader isEditing={Boolean(editingBank)} onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <BankUserSelectFields
            users={users}
            isAdmin={isAdmin}
            selectedUserId={formData.userId}
            userName={formData.userName}
            userEmail={formData.userEmail}
            onSelectUser={({ userId, name, email }) =>
              setFormData((prev) => ({
                ...prev,
                userId,
                userName: name,
                userEmail: email,
                accountName: name,
              }))
            }
            onClearError={() => setError("")}
          />

          <BankFormInputs
            formData={formData}
            isCashAccount={formData.bankName.trim().toLowerCase() === "cash"}
            onChange={handleChange}
          />

          <BankModalFooter isEditing={Boolean(editingBank)} submitting={submitting} onClose={onClose} />
        </form>
      </div>
    </div>
  );
};

export default BankDetailFormModal;