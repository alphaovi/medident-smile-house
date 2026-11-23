import { useState, useMemo } from "react";
import { calculateSelectedDueSum, formatCustomerOrders } from "./payment.utils";

export const usePaymentSelection = (allOrders) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const loadCustomerOrders = (customerId, ordersSource = allOrders) => {
    setCases(formatCustomerOrders(customerId, ordersSource));
    setSelectedCases([]);
    setTotalAmount(0);
  };

  const handleSelectState = (divisionVal) => {
    setSelectedState(divisionVal);
    setSelectedCustomerId("");
    setClientName("");
    setAddress("");
    setCases([]);
    setSelectedCases([]);
    setTotalAmount(0);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer._id);
    setClientName(customer.name || "");
    setAddress(customer.address || "");
    if (customer.division) setSelectedState(customer.division);
    loadCustomerOrders(customer._id);
  };

  const handleSelectAll = () => {
    const allIds = selectedCases.length === cases.length ? [] : cases.map((c) => c.id);
    setSelectedCases(allIds);
    setTotalAmount(calculateSelectedDueSum(allIds, cases));
  };

  const handleSelectCase = (id) => {
    const updated = selectedCases.includes(id)
      ? selectedCases.filter((item) => item !== id)
      : [...selectedCases, id];
    setSelectedCases(updated);
    setTotalAmount(calculateSelectedDueSum(updated, cases));
  };

  const maxPayableAmount = useMemo(() => calculateSelectedDueSum(selectedCases, cases), [selectedCases, cases]);

  const handleTotalAmountChange = (val) => {
    const numeric = val === "" ? 0 : Math.max(0, Number(val));
    setTotalAmount(maxPayableAmount > 0 ? Math.min(numeric, maxPayableAmount) : numeric);
  };

  return {
    selectedState, selectedCustomerId, clientName, setClientName, address,
    cases, selectedCases, totalAmount, maxPayableAmount,
    loadCustomerOrders, handleSelectState, handleSelectCustomer,
    handleSelectAll, handleSelectCase, handleTotalAmountChange,
  };
};