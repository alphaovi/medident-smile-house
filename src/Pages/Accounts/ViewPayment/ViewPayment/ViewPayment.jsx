import { useEffect, useState, useCallback, useMemo } from "react";
import PaymentHeader from "../ViewPaymentHeader/PaymentHeader";
import PaymentTable from "../ViewPaymentTable/PaymentTable";
import PaymentSearchFilter from "../ViewPaymentSearchFilter/PaymentSearchFilter";

import { customerService } from "../../../../services/useCustomerService/useCustomerService";
import { useSaleOrderServices } from "../../../../services/saleOrderService/useSaleOrderServices";

const ViewPayment = () => {
  // Raw sale orders fetched from database via useSaleOrderServices
  const [payments, setPayments] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to hold filter options submitted from PaymentSearchFilter
  const [filterCriteria, setFilterCriteria] = useState(null);

  useEffect(() => {
    const loadPaymentPageData = async () => {
      try {
        setLoading(true);
        const [orders, customers] = await Promise.all([
          useSaleOrderServices.getAllSaleOrders(),
          customerService.getAllCustomers().catch(() => []),
        ]);

        setPayments(Array.isArray(orders) ? orders : []);
        setCustomersList(Array.isArray(customers) ? customers : []);
      } catch (err) {
        console.error("Failed to load payment data:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentPageData();
  }, []);

  // Handler to create a new payment action
  const handleCreatePayment = () => {
    console.log("Navigate or open modal to Create Payment");
  };

  // Memoized handler to prevent infinite re-render loop in PaymentSearchFilter
  const handleFilterSearch = useCallback((criteria) => {
    setFilterCriteria((prev) => {
      if (prev === null && criteria === null) return prev;
      if (
        prev &&
        criteria &&
        prev.state === criteria.state &&
        prev.customerId === criteria.customerId &&
        prev.clientName === criteria.clientName &&
        prev.officeAddress === criteria.officeAddress &&
        prev.fromDate === criteria.fromDate &&
        prev.toDate === criteria.toDate
      ) {
        return prev;
      }
      return criteria;
    });
  }, []);

  // Quick summary stats across all payments
  const summaryStats = useMemo(() => {
    let totalCount = 0;
    let totalAmount = 0;

    if (Array.isArray(payments)) {
      payments.forEach((order) => {
        const list = Array.isArray(order?.payments) ? order.payments : [];
        list.forEach((pay) => {
          totalCount += 1;
          totalAmount += Number(pay?.amount) || 0;
        });
      });
    }

    return { totalCount, totalAmount };
  }, [payments]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 p-4 md:p-6 lg:p-8">
      <div className="w-full space-y-6">
        {/* Header containing title, stats and Create Payment button */}
        <PaymentHeader
          onCreatePayment={handleCreatePayment}
          totalTransactions={summaryStats.totalCount}
          totalAmount={summaryStats.totalAmount}
        />

        {/* Dynamic Filter Search Form (State -> Client/Customer -> Auto-filled Address + Date Range) */}
        <PaymentSearchFilter
          ordersData={payments}
          customersData={customersList}
          onFilter={handleFilterSearch}
        />

        {/* Main Data Table Section */}
        {loading ? (
          <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm py-14 text-center">
            <div className="inline-block w-7 h-7 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm font-medium text-slate-500">
              Loading payments...
            </p>
          </div>
        ) : (
          <PaymentTable paymentData={payments} filters={filterCriteria} />
        )}
      </div>
    </div>
  );
};

export default ViewPayment;