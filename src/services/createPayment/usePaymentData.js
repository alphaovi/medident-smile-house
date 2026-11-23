import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { customerService } from "../useCustomerService/useCustomerService";
import { useSaleOrderServices } from "../saleOrderService/useSaleOrderServices";
import { bankDetailService } from "../bankDetail/bankDetailService";
import { AuthService } from "../auth/auth.service";
import { buildMergedActiveUsers } from "./payment.utils";

export const usePaymentData = (currentUser) => {
  const [customersList, setCustomersList] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [banksList, setBanksList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState(currentUser?._id || "");
  const [selectedBankId, setSelectedBankId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const fetchBanks = bankDetailService?.getAllBankDetails || bankDetailService?.fetchBankDetails;
        const [customers, orders, banks, users] = await Promise.all([
          customerService.getAllCustomers(),
          useSaleOrderServices.getAllSaleOrders(),
          typeof fetchBanks === "function" ? fetchBanks().catch(() => []) : Promise.resolve([]),
          AuthService.getAllUsers().catch(() => []),
        ]);

        const banksArr = Array.isArray(banks) ? banks : [];
        setCustomersList(Array.isArray(customers) ? customers : []);
        setAllOrders(Array.isArray(orders) ? orders : []);
        setBanksList(banksArr);
        setUsersList(buildMergedActiveUsers(Array.isArray(users) ? users : [], banksArr, currentUser));
        if (!selectedOwnerId && currentUser?._id) setSelectedOwnerId(currentUser._id);
      } catch (err) {
        toast.error(err.message || "Failed to load data");
      }
    };
    load();
  }, []);

  const userAccounts = useMemo(
    () =>
      banksList.filter(
        (acc) => acc.isActive !== false && String(acc.user?._id || acc.user) === String(selectedOwnerId)
      ),
    [banksList, selectedOwnerId]
  );

  const statesList = useMemo(
    () => Array.from(new Set(customersList.map((c) => c.division).filter(Boolean))),
    [customersList]
  );

  const handleSelectOwner = (ownerId) => {
    setSelectedOwnerId(ownerId);
    setSelectedBankId("");
  };

  return {
    customersList, allOrders, setAllOrders, usersList, statesList,
    selectedOwnerId, userAccounts, selectedBankId, setSelectedBankId, handleSelectOwner,
  };
};