import { useState, useEffect, useMemo, useCallback } from 'react';
import ClientFilterSection from './ClientFilterSection';
import ClientStatementTable from './ClientStatementTable';
import ClientStatementSummary from './ClientStatementSummary';

import { AlertCircle, X, Printer, PrinterCheck, Loader2 } from 'lucide-react';
import GlobalStatementPrint from '../../../SharedPages/GlobalStatementPrint/GlobalStatementPrint';
import IndividualOrderPrint from './IndividualOrderPrint';

const ClientStatement = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [companyInfo, setCompanyInfo] = useState({});
  const [customersList, setCustomersList] = useState([]);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);

  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchCustomerText, setSearchCustomerText] = useState('');
  
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [orderStatus, setOrderStatus] = useState('all'); 
  
  const [isSearched, setIsSearched] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [tableData, setTableData] = useState([]);

  // Modal & Print State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintingOrder, setIsPrintingOrder] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  // Fetch Company Settings
  useEffect(() => {
    fetch(`${BASE_URL}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData) {
          const info = resData.data || resData;
          setCompanyInfo({
            name: info.companyName || info.name || '',
            address: info.address || info.companyAddress || '',
            phone: info.phone || info.companyPhone || '',
          });
        }
      })
      .catch((err) => console.error('Error fetching company info:', err));
  }, [BASE_URL]);

  // Step 1: Load Customers First (Super Fast with Session Caching)
  useEffect(() => {
    const cachedCustomers = sessionStorage.getItem('medident_cached_customers');
    if (cachedCustomers) {
      try {
        setCustomersList(JSON.parse(cachedCustomers));
        setIsCustomerLoading(false);
      } catch (e) {
        console.error('Error parsing cached customers', e);
      }
    }

    fetch(`${BASE_URL}/customers`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        const data = resData.data || resData || [];
        const formattedCustomers = data.map((c) => ({
          id: c._id,
          customId: c.id || '',
          name: c.name || 'Unnamed Customer',
          address: c.address || c.division || 'N/A',
          phone: c.phone || '',
        }));
        setCustomersList(formattedCustomers);
        sessionStorage.setItem('medident_cached_customers', JSON.stringify(formattedCustomers));
      })
      .catch((err) => console.error('Error fetching customers:', err))
      .finally(() => setIsCustomerLoading(false));
  }, [BASE_URL]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredCustomers = useMemo(() => {
    const query = (searchCustomerText || '').toLowerCase().trim();
    if (!query) return customersList;

    return customersList.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.customId.toLowerCase().includes(query) ||
        c.phone.includes(query)
    );
  }, [customersList, searchCustomerText]);

  const selectedCustomerObj = useMemo(() => {
    if (!selectedCustomer) return null;
    return customersList.find((c) => String(c.id) === String(selectedCustomer));
  }, [selectedCustomer, customersList]);

  const autoAddress = selectedCustomerObj?.address || 'Select a Customer to view address';

  // Step 2: Fetch orders specifically for the selected customer when selection or filters change
  const handleFetchCustomerOrders = useCallback(async () => {
    if (!selectedCustomer) {
      setTableData([]);
      setIsSearched(false);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const response = await fetch(
        `${BASE_URL}/sales-orders/statement/${selectedCustomer}?fromDate=${fromDate}&toDate=${toDate}&paymentStatus=${paymentStatus}&orderStatus=${orderStatus}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();

      if (result.success) {
        let fetchedData = result.data || [];

        if (orderStatus !== 'all') {
          fetchedData = fetchedData.filter(
            (item) => (item.status || '').toLowerCase() === orderStatus.toLowerCase()
          );
        }

        setTableData(fetchedData);
        setIsSearched(true);
      } else {
        triggerToast(result.message || 'Failed to fetch statement data');
        setTableData([]);
        setIsSearched(true);
      }
    } catch (error) {
      console.error('Statement fetch error:', error);
      triggerToast('Server error while fetching statement');
      setTableData([]);
      setIsSearched(true);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [BASE_URL, selectedCustomer, fromDate, toDate, paymentStatus, orderStatus]);

  useEffect(() => {
    if (selectedCustomer) {
      handleFetchCustomerOrders();
    }
  }, [selectedCustomer, fromDate, toDate, paymentStatus, orderStatus, handleFetchCustomerOrders]);

  // Accurate Totals Calculation (Orders only)
  const { totalPaid, totalUnpaid } = useMemo(() => {
    return tableData.reduce(
      (acc, curr) => {
        const paid = curr.payments && curr.payments.length > 0
          ? curr.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0)
          : (Number(curr.paidAmount) || 0);
        const grandTotal = Number(curr.grandTotal) || (paid + (Number(curr.dueAmount) || 0));
        const due = Math.max(0, grandTotal - paid);
        
        acc.totalPaid += paid;
        acc.totalUnpaid += due;
        return acc;
      },
      { totalPaid: 0, totalUnpaid: 0 }
    );
  }, [tableData]);

  const handlePrint = () => {
    setIsPrintingOrder(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintIndividualOrder = () => {
    setIsPrintingOrder(true);
    setIsModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const printColumns = [
    { key: 'sl', label: 'SL', align: 'center' },
    { key: 'date', label: 'ORDER DATE', align: 'left' },
    { key: 'desc', label: 'DESCRIPTION / ORDER ID', align: 'left' },
    { key: 'billed', label: 'TOTAL BILL', align: 'right' },
    { key: 'paid', label: 'PAID AMOUNT', align: 'right' },
    { key: 'due', label: 'UNPAID (DUE)', align: 'right' },
  ];

  const printRows = tableData.map((item, idx) => {
    const paid = item.payments && item.payments.length > 0
      ? item.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0)
      : (Number(item.paidAmount) || 0);
    const total = Number(item.grandTotal) || (paid + (Number(item.dueAmount) || 0));
    const due = Math.max(0, total - paid);

    return {
      sl: idx + 1,
      date: item.orderDate ? new Date(item.orderDate).toLocaleDateString('en-GB') : '-',
      desc: `Order #${item._id?.slice(-6).toUpperCase()} (${item.products?.length || 0} Items)`,
      billed: `৳${total.toLocaleString()}`,
      paid: paid > 0 ? `৳${paid.toLocaleString()}` : '-',
      due: due > 0 ? `৳${due.toLocaleString()}` : '-',
    };
  });

  const printSummary = [
    { label: 'TOTAL BILLED', value: `৳${(totalPaid + totalUnpaid).toLocaleString()}` },
    { label: 'TOTAL PAID', value: `৳${totalPaid.toLocaleString()}` },
    { label: 'TOTAL DUE / UNPAID', value: `৳${totalUnpaid.toLocaleString()}`, isBold: true },
  ];

  const modalPaidAmount = selectedOrder?.payments && selectedOrder.payments.length > 0
    ? selectedOrder.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0)
    : (Number(selectedOrder?.paidAmount) || 0);
  const modalDueAmount = Math.max(0, (selectedOrder?.grandTotal || 0) - modalPaidAmount);

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 p-4 md:p-8 font-sans relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-rose-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce print:hidden">
          <AlertCircle className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:bg-rose-700 p-1 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4 print:hidden">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Client Statement
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Detailed delivery statements and account balance breakdown
            </p>
          </div>
          {isSearched && !isLoadingOrders && tableData.length > 0 && (
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Statement
            </button>
          )}
        </div>

        <div className="print:hidden">
          <ClientFilterSection
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            searchCustomerText={searchCustomerText}
            setSearchCustomerText={setSearchCustomerText}
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
            orderStatus={orderStatus}
            setOrderStatus={setOrderStatus}
            autoAddress={autoAddress}
            filteredCustomers={filteredCustomers}
            isCustomerLoading={isCustomerLoading}
          />
        </div>

        {/* Loading Spinner for Orders */}
        {isLoadingOrders ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center shadow-xl w-full print:hidden">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-semibold text-sm">Loading customer orders, please wait...</p>
          </div>
        ) : (
          isSearched && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl w-full print:hidden">
              <ClientStatementTable
                tableData={tableData}
                paymentStatus={paymentStatus}
                openingBalance={0}
                onViewOrder={handleViewOrder}
              />

              <ClientStatementSummary
                paymentStatus={paymentStatus}
                totalPaid={totalPaid}
                totalUnpaid={totalUnpaid}
                openingBalance={0}
              />
            </div>
          )
        )}

        {isSearched && !isLoadingOrders && tableData.length > 0 && !isPrintingOrder && (
          <GlobalStatementPrint
            companyName={companyInfo.name}
            companyAddress={companyInfo.address}
            companyPhone={companyInfo.phone}
            reportTitle="CLIENT ACCOUNT STATEMENT"
            clientInfo={{
              name: selectedCustomerObj?.name || '',
              address: autoAddress,
              accountId: selectedCustomerObj?.customId || selectedCustomer?.slice(-8).toUpperCase() || '',
            }}
            metaInfo={{
              periodFrom: fromDate,
              periodTo: toDate,
              currency: 'Bangladeshi Taka (BDT)',
              statusFilter: `${paymentStatus} / ${orderStatus}`,
            }}
            columns={printColumns}
            rows={printRows}
            summaryRows={printSummary}
          />
        )}

        {isPrintingOrder && selectedOrder && (
          <IndividualOrderPrint
            companyInfo={companyInfo}
            order={selectedOrder}
            customerObj={selectedCustomerObj}
            autoAddress={autoAddress}
          />
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Order Details</h3>
                <p className="text-xs text-slate-400">Order ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-bold">Order Date</p>
                  <p className="font-semibold text-slate-800">
                    {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-GB') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">Order Status</p>
                  <p className="font-semibold text-blue-600 uppercase">{selectedOrder.status || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">Grand Total</p>
                  <p className="font-semibold text-slate-800">৳{selectedOrder.grandTotal || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">Due Amount</p>
                  <p className="font-semibold text-rose-600">৳{modalDueAmount}</p>
                </div>
              </div>

              {/* Payments History Section with Total Footer */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Payment History</h4>
                {selectedOrder.payments && selectedOrder.payments.length > 0 ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-emerald-50 text-emerald-900 font-bold border-b border-slate-200">
                          <th className="p-3">Payment Date</th>
                          <th className="p-3">Method</th>
                          <th className="p-3 text-right">Amount Paid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.payments.map((pay, pIdx) => (
                          <tr key={pIdx}>
                            <td className="p-3 font-medium text-slate-800">
                              {pay.date ? new Date(pay.date).toLocaleDateString('en-GB') : '-'}
                            </td>
                            <td className="p-3 font-medium text-slate-600">{pay.paymentMethod || 'Cash'}</td>
                            <td className="p-3 text-right font-extrabold text-emerald-600">৳{pay.amount || 0}</td>
                          </tr>
                        ))}
                        {/* Total Paid Row inside Modal Table */}
                        <tr className="bg-emerald-50/80 font-bold border-t border-slate-200">
                          <td colSpan={2} className="p-3 text-right text-emerald-900">Total Paid:</td>
                          <td className="p-3 text-right font-black text-emerald-700">৳{modalPaidAmount.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-xs text-slate-400 mb-6">
                    No payment records found for this order.
                  </div>
                )}
              </div>

              {/* Products List Section */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Products List</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold">
                        <th className="p-3">Product</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.products?.map((prod, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-medium text-slate-800">
                            {prod.product?.name || prod.product || 'Product Item'}
                          </td>
                          <td className="p-3 text-center">{prod.quantity || prod.orderQty || 0}</td>
                          <td className="p-3 text-right">৳{prod.unitPrice || 0}</td>
                          <td className="p-3 text-right font-bold">৳{prod.afterDiscount || prod.totalPrice || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={handlePrintIndividualOrder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <PrinterCheck className="w-4 h-4" /> Print Order
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientStatement;