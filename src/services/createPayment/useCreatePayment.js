import { useState } from "react";
import { toast } from "react-toastify";
import { useSaleOrderServices } from "../saleOrderService/useSaleOrderServices";
import { useAuth } from "../../Contexts/AuthContext";
import { getStoredUser } from "../auth/api";
import { usePaymentData } from "./usePaymentData";
import { usePaymentSelection } from "./usePaymentSelection";
import { processPaymentSubmission } from "./paymentSubmit.service";

export const useCreatePayment = () => {
  const { user } = useAuth();
  const currentUser = user || getStoredUser();

  const data = usePaymentData(currentUser);
  const selection = usePaymentSelection(data.allOrders);

  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const ok = await processPaymentSubmission({
        ...selection,
        ...data,
        note,
        receiptFile,
      });
      if (!ok) return;

      setNote("");
      setReceiptFile(null);
      const refreshed = await useSaleOrderServices.getAllSaleOrders();
      const ordersArr = Array.isArray(refreshed) ? refreshed : [];
      data.setAllOrders(ordersArr);
      selection.loadCustomerOrders(selection.selectedCustomerId, ordersArr);
    } catch (error) {
      toast.error(error.message || "Failed to record payment!");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    ...data,
    ...selection,
    note,
    setNote,
    receiptFile,
    setReceiptFile,
    submitting,
    handleSubmit,
  };
};