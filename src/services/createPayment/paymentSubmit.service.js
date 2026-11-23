import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSaleOrderServices } from "../saleOrderService/useSaleOrderServices";
import { validateAndConfirmPayment } from "./payment.validators";

export const processPaymentSubmission = async (params) => {
  const selectedBank = await validateAndConfirmPayment(params);
  if (!selectedBank) return false;

  const { selectedCases, cases, totalAmount, note, receiptFile } = params;
  const receiptName = receiptFile ? receiptFile.name : null;
  let remaining = Number(totalAmount) || 0;

  for (const orderId of selectedCases) {
    if (remaining <= 0) break;
    const orderItem = cases.find((c) => c.id === orderId);
    if (!orderItem || orderItem.dueAmount <= 0) continue;

    const payAmount = Math.min(remaining, orderItem.dueAmount);
    remaining -= payAmount;

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
      const paidAmount = (Number(orderItem.paidAmount) || 0) + payAmount;
      await useSaleOrderServices.updateSaleOrder(orderId, {
        paidAmount,
        dueAmount: Math.max(0, (Number(orderItem.grandTotal) || 0) - paidAmount),
        payments: [...(orderItem.payments || []), { date: new Date().toISOString(), ...payload }],
      });
    }
  }

  Swal.fire({ title: "Success!", text: "Your payment has been recorded and deposited successfully.", icon: "success", timer: 3000, timerProgressBar: true, showConfirmButton: false });
  toast.success("Payment submitted successfully!");
  return true;
};