export const INITIAL_BANK_FORM = {
  userId: "",
  userName: "",
  userEmail: "",
  bankName: "",
  accountNo: "",
  accountName: "",
  branch: "",
  details: "",
  isActive: true,
};

export const filterBanksList = (banks, searchQuery, statusFilter) => {
  return banks.filter((bank) => {
    const isActive = bank.isActive !== false;
    if (statusFilter === "active" && !isActive) return false;
    if (statusFilter === "inactive" && isActive) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return [
      bank.bankName,
      bank.accountName,
      bank.accountNo,
      bank.branch,
      bank.details,
      bank.user?.name,
      bank.user?.email,
    ].some((field) => field?.toLowerCase().includes(q));
  });
};

export const validateBankFormData = (formData, isAdmin) => {
  const userName = formData.userName.trim();
  const userEmail = formData.userEmail.trim();
  const bankName = formData.bankName.trim();
  const accountNo = formData.accountNo.trim();
  const accountName = formData.accountName.trim();

  if (!userName || !userEmail) return "User Name and Email are required.";
  if (isAdmin && !formData.userId) return "Please select a valid user from the list.";
  if (!bankName) return "Account / Bank Name is required.";
  if (bankName.toLowerCase() !== "cash" && !accountNo) {
    return "Account Number is required for non-cash accounts.";
  }
  if (!accountName) return "Account Holder Name is required.";
  return "";
};