import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const validateAndConfirmPayment = async ({
  selectedCustomerId,
  selectedCases,
  totalAmount,
  selectedOwnerId,
  selectedBankId,
  userAccounts,
  usersList,
}) => {
  if (!selectedCustomerId) return toast.warn("Please select a customer first!") && null;
  if (selectedCases.length === 0) return toast.warn("Please select at least one order to pay!") && null;
  if (totalAmount <= 0) return toast.warn("Total paying amount must be greater than 0!") && null;
  if (!selectedOwnerId) return toast.warn("Please select an account owner!") && null;
  if (!selectedBankId) return toast.warn("Please select an account to deposit!") && null;

  const selectedBank = userAccounts.find((b) => String(b._id) === String(selectedBankId));
  if (!selectedBank) return toast.warn("Selected account is invalid!") && null;

  const selectedOwner = usersList.find((u) => String(u._id) === String(selectedOwnerId));

  const result = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to deposit ${totalAmount} TK into ${selectedBank.bankName} (${selectedOwner?.name || selectedBank.accountName})`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#10B981",
    cancelButtonColor: "#EF4444",
    confirmButtonText: "Yes, Confirm Payment",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) {
    if (result.dismiss === Swal.DismissReason.cancel) toast.error("Payment request cancelled!");
    return null;
  }

  return selectedBank;
};