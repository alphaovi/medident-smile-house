import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PaymentSearchHeader from "./PaymentSearchHeader";
import PaymentTable from "./PaymentTable";
import PaymentSummary from "./PaymentSummary";
import { customerService } from "../../../services/useCustomerService/useCustomerService";
import { useSaleOrderServices } from "../../../services/saleOrderService/useSaleOrderServices";
import { bankDetailService } from "../../../services/bankDetail/bankDetailService";

const CreatePayment = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [banksList, setBanksList] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");

  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [paymentType, setPaymentType] = useState("Cash");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const calculateSelectedDueSum = (idsList, ordersArr = cases) => {
    return idsList.reduce((sum, id) => {
      const item = ordersArr.find((c) => c.id === id);
      return sum + (item ? Number(item.dueAmount) || 0 : 0);
    }, 0);
  };

  const loadAllInitialData = async () => {
    try {
      const fetchBanksFn =
        bankDetailService?.getAllBankDetails || bankDetailService?.fetchBankDetails;

      const [customersData, ordersData, banksData] = await Promise.all([
        customerService.getAllCustomers(),
        useSaleOrderServices.getAllSaleOrders(),
        typeof fetchBanksFn === "function" ? fetchBanksFn().catch(() => []) : Promise.resolve([]),
      ]);

      setDoctorsList(Array.isArray(customersData) ? customersData : []);
      setAllOrders(Array.isArray(ordersData) ? ordersData : []);
      setBanksList(Array.isArray(banksData) ? banksData : []);
    } catch (error) {
      console.error("Failed to load initial payment data:", error);
      toast.error(error.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadAllInitialData();
  }, []);

  // Unique States list from customers
  const statesList = useMemo(() => {
    const set = new Set();
    doctorsList.forEach((doc) => {
      const st = doc.division || doc.state || doc.stateOrRegion;
      if (st) set.add(st);
    });
    return Array.from(set);
  }, [doctorsList]);

  // Format and load sale orders linked to customer's ObjectId
  const loadCustomerOrders = (customerId, ordersSource = allOrders) => {
    const matched = ordersSource
      .filter((ord) => {
        const custObjId =
          typeof ord.customer === "object"
            ? ord.customer?._id || ord.customer?.id
            : ord.customer;
        return String(custObjId) === String(customerId);
      })
      .map((ord) => {
        const grandTotal = Number(ord.grandTotal) || 0;
        const paidAmount = Number(ord.paidAmount) || 0;
        const dueAmount =
          ord.dueAmount !== undefined
            ? Number(ord.dueAmount)
            : Math.max(0, grandTotal - paidAmount);

        return {
          id: ord._id,
          orderNo: ord.orderNumber || ord.id || ord._id?.slice(-6)?.toUpperCase(),
          orderDate: ord.orderDate
            ? new Date(ord.orderDate).toISOString().split("T")[0]
            : "-",
          grandTotal,
          paidAmount,
          dueAmount,
          status: ord.status || "pending",
          payments: Array.isArray(ord.payments) ? ord.payments : [],
        };
      });

    setCases(matched);
    setSelectedCases([]);
    setTotalAmount(0);
  };

  const handleSelectState = (stateVal) => {
    setSelectedState(stateVal);
    setSelectedDoctorId("");
    setClientName("");
    setAddress("");
    setCases([]);
    setSelectedCases([]);
    setTotalAmount(0);
  };

  const handleSelectDoctor = (doctor) => {
    const docId = doctor._id;
    setSelectedDoctorId(docId);
    setClientName(doctor.doctorName || doctor.name || doctor.customerName || "");
    setAddress(doctor.address || doctor.fullAddress || "Dhaka, Bangladesh");
    if (doctor.division || doctor.state) {
      setSelectedState(doctor.division || doctor.state);
    }

    loadCustomerOrders(docId);
  };

  const handleSelectAll = () => {
    if (selectedCases.length === cases.length) {
      setSelectedCases([]);
      setTotalAmount(0);
    } else {
      const allIds = cases.map((c) => c.id);
      setSelectedCases(allIds);
      setTotalAmount(calculateSelectedDueSum(allIds));
    }
  };

  const handleSelectCase = (id) => {
    const updatedIds = selectedCases.includes(id)
      ? selectedCases.filter((item) => item !== id)
      : [...selectedCases, id];

    setSelectedCases(updatedIds);
    setTotalAmount(calculateSelectedDueSum(updatedIds));
  };

  const maxPayableAmount = useMemo(() => {
    return calculateSelectedDueSum(selectedCases);
  }, [selectedCases, cases]);

  const handleTotalAmountChange = (val) => {
    const numeric = val === "" ? 0 : Math.max(0, Number(val));
    const capped = maxPayableAmount > 0 ? Math.min(numeric, maxPayableAmount) : numeric;
    setTotalAmount(capped);
  };

  // Submit with SweetAlert2 & Backend API Sync
  const handleSubmit = async () => {
    if (!selectedDoctorId) {
      toast.warn("Please select a doctor/customer first!");
      return;
    }

    if (selectedCases.length === 0) {
      toast.warn("Please select at least one order to pay!");
      return;
    }

    if (totalAmount <= 0) {
      toast.warn("Total paying amount must be greater than 0!");
      return;
    }

    let selectedBank = null;
    if (paymentType === "Bank") {
      if (!selectedBankId) {
        toast.warn("Please select a bank account!");
        return;
      }
      selectedBank = banksList.find((b) => String(b._id) === String(selectedBankId));
    }

    const selectedMethodLabel =
      paymentType === "Bank" && selectedBank ? selectedBank.bankName : "Cash";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to pay ${totalAmount} TK via ${selectedMethodLabel}`,
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
      return;
    }

    try {
      setSubmitting(true);
      const receiptName = receiptFile ? receiptFile.name : null;

      // Distribute totalAmount across selected orders up to each order's dueAmount
      let remainingToAllocate = Number(totalAmount) || 0;

      for (const orderId of selectedCases) {
        if (remainingToAllocate <= 0) break;

        const orderItem = cases.find((c) => c.id === orderId);
        if (!orderItem || orderItem.dueAmount <= 0) continue;

        const payAmount = Math.min(remainingToAllocate, orderItem.dueAmount);
        remainingToAllocate -= payAmount;

        const payload =
          paymentType === "Bank" && selectedBank
            ? {
                amount: payAmount,
                paymentMethod: selectedBank.bankName,
                bankId: selectedBank._id,
                bankDetails: {
                  bankName: selectedBank.bankName,
                  accountNo: selectedBank.accountNo,
                  accountName: selectedBank.accountName,
                  branch: selectedBank.branch || "",
                  details: selectedBank.details || "",
                },
                status: "Approved",
                note: note.trim(),
                receipt: receiptName,
              }
            : {
                amount: payAmount,
                paymentMethod: "Cash",
                bankId: null,
                bankDetails: null,
                status: "Approved",
                note: note.trim(),
                receipt: receiptName,
              };

        if (typeof useSaleOrderServices.addPaymentToSaleOrder === "function") {
          await useSaleOrderServices.addPaymentToSaleOrder(orderId, payload);
        } else {
          // Fallback if addPaymentToSaleOrder is not present
          const updatedPaid = (Number(orderItem.paidAmount) || 0) + payAmount;
          const updatedDue = Math.max(0, (Number(orderItem.grandTotal) || 0) - updatedPaid);
          const updatedPayments = [
            ...(orderItem.payments || []),
            {
              date: new Date().toISOString(),
              amount: payAmount,
              paymentMethod: payload.paymentMethod,
              bankId: payload.bankId,
              bankDetails: payload.bankDetails,
              status: payload.status,
              note: payload.note,
              receipt: payload.receipt,
            },
          ];

          await useSaleOrderServices.updateSaleOrder(orderId, {
            paidAmount: updatedPaid,
            dueAmount: updatedDue,
            payments: updatedPayments,
          });
        }
      }

      Swal.fire({
        title: "Success!",
        text: "Your payment has been recorded successfully.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      toast.success("Payment submitted successfully!");

      // Reset optional inputs & refresh orders
      setNote("");
      setReceiptFile(null);

      const refreshedOrders = await useSaleOrderServices.getAllSaleOrders();
      const ordersArr = Array.isArray(refreshedOrders) ? refreshedOrders : [];
      setAllOrders(ordersArr);
      loadCustomerOrders(selectedDoctorId, ordersArr);
    } catch (error) {
      console.error("Payment submit error:", error);
      toast.error(error.message || "Failed to record payment!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <PaymentSearchHeader
        selectedState={selectedState}
        onSelectState={handleSelectState}
        statesList={statesList}
        clientName={clientName}
        setClientName={setClientName}
        address={address}
        doctorsList={doctorsList}
        onSelectDoctor={handleSelectDoctor}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <PaymentTable
          cases={cases}
          selectedCases={selectedCases}
          onSelectAll={handleSelectAll}
          onSelectCase={handleSelectCase}
        />

        <PaymentSummary
          totalAmount={totalAmount}
          onTotalAmountChange={handleTotalAmountChange}
          maxPayableAmount={maxPayableAmount}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          banksList={banksList}
          selectedBankId={selectedBankId}
          setSelectedBankId={setSelectedBankId}
          note={note}
          setNote={setNote}
          receiptFile={receiptFile}
          onFileChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default CreatePayment;