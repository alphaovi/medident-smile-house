import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSaleOrderServices } from "../../../services/saleOrderService/useSaleOrderServices";

export const processPaymentSubmission = async ({
  selectedCustomerId,
  selectedCases,
  cases,
  totalAmount,
  selectedOwnerId,
  selectedBankId,
  userAccounts,
  usersList,
  note,
  receiptFile,
}) => {
  if (!selectedCustomerId) {
    toast.warn("Please select a customer first!");
    return false;
  }
  if (selectedCases.length === 0) {
    toast.warn("Please select at least one order to pay!");
    return false;
  }
  if (totalAmount <= 0) {
    toast.warn("Total paying amount must be greater than 0!");
    return false;
  }
  if (!selectedOwnerId) {
    toast.warn("Please select an account owner!");
    return false;
  }
  if (!selectedBankId) {
    toast.warn("Please select an account to deposit!");
    return false;
  }

  const selectedBank = userAccounts.find((b) => String(b._id) === String(selectedBankId));
  if (!selectedBank) {
    toast.warn("Selected account is invalid!");
    return false;
  }

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
    if (result.dismiss === Swal.DismissReason.cancel) {
      toast.error("Payment request cancelled!");
    }
    return false;
  }

  const receiptName = receiptFile ? receiptFile.name : null;
  let remainingToAllocate = Number(totalAmount) || 0;

  for (const orderId of selectedCases) {
    if (remainingToAllocate <= 0) break;
    const orderItem = cases.find((c) => c.id === orderId);
    if (!orderItem || orderItem.dueAmount <= 0) continue;

    const payAmount = Math.min(remainingToAllocate, orderItem.dueAmount);
    remainingToAllocate -= payAmount;

    const payload = {
      amount: payAmount,
      paymentMethod: selectedBank.bankName,
      bankId: selectedBank._id,
      bankDetails: {
        bankName: selectedBank.bankName,
        accountNo: selectedBank.accountNo || "",
        accountName: selectedBank.accountName,
        branch: selectedBank.branch || "",
        details: selectedBank.details || "",
      },
      status: "Approved",
      note: note.trim(),
      receipt: receiptName,
    };

    if (typeof useSaleOrderServices.addPaymentToSaleOrder === "function") {
      await useSaleOrderServices.addPaymentToSaleOrder(orderId, payload);
    } else {
      const updatedPaid = (Number(orderItem.paidAmount) || 0) + payAmount;
      const updatedDue = Math.max(0, (Number(orderItem.grandTotal) || 0) - updatedPaid);
      await useSaleOrderServices.updateSaleOrder(orderId, {
        paidAmount: updatedPaid,
        dueAmount: updatedDue,
        payments: [...(orderItem.payments || []), { date: new Date().toISOString(), ...payload }],
      });
    }
  }

  Swal.fire({
    title: "Success!",
    text: "Your payment has been recorded and deposited successfully.",
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });

  toast.success("Payment submitted successfully!");
  return true;
};