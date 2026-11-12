import { useState, useEffect, useMemo } from 'react';
import ClientFilterSection from './ClientFilterSection';
import ClientStatementTable from './ClientStatementTable';
import ClientStatementSummary from './ClientStatementSummary';

import { AlertCircle, X, Printer } from 'lucide-react';
import GlobalStatementPrint from '../../../SharedPages/GlobalStatementPrint/GlobalStatementPrint';

const ClientStatement = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [reportData, setReportData] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchCustomerText, setSearchCustomerText] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [isSearched, setIsSearched] = useState(false);
  const [tableData, setTableData] = useState([]);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const OPENING_BALANCE = 0;

  useEffect(() => {
    fetch(`${BASE_URL}/sales-orders`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        const data = resData.data || resData || [];
        setReportData(data);

        const uniqueCustomers = [];
        const map = new Map();
        data.forEach((item) => {
          if (item.customer && !map.has(item.customer._id)) {
            map.set(item.customer._id, true);
            uniqueCustomers.push({
              id: item.customer._id,
              name: item.customer.name || item.customer.patientName || "Unnamed Customer",
              address: item.customer.address || item.stateOrRegion || "N/A",
              phone: item.customer.phone || item.customer.mobile || "N/A"
            });
          }
        });
        setCustomersList(uniqueCustomers);
      })
      .catch((err) => console.error('Error fetching initial sales orders:', err));
  }, [BASE_URL]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) =>
      c.name.toLowerCase().includes((searchCustomerText || '').toLowerCase())
    );
  }, [customersList, searchCustomerText]);

  const selectedCustomerObj = useMemo(() => {
    if (!selectedCustomer) return null;
    return customersList.find((c) => String(c.id) === String(selectedCustomer));
  }, [selectedCustomer, customersList]);

  const autoAddress = selectedCustomerObj?.address || 'Select a Customer to view address';

  const handleSearch = async () => {
    if (!selectedCustomer) {
      triggerToast('Please Select a Customer to load statement');
      return;
    }
    if (paymentStatus === 'none') {
      triggerToast('Please Select Payment Status (ALL, PAID, or UNPAID)');
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/sales-orders/statement/${selectedCustomer}?fromDate=${fromDate}&toDate=${toDate}&paymentStatus=${paymentStatus}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      
      if (result.success) {
        setTableData(result.data || []);
        setIsSearched(true);
      } else {
        triggerToast(result.message || 'Failed to fetch statement data');
      }
    } catch (error) {
      console.error('Statement fetch error:', error);
      triggerToast('Server error while fetching statement');
    }
  };

  const { totalPaid, totalUnpaid } = useMemo(() => {
    return tableData.reduce(
      (acc, curr) => {
        const due = Number(curr.dueAmount) || 0;
        const paid = Number(curr.paidAmount) || 0;
        acc.totalPaid += paid;
        acc.totalUnpaid += due;
        return acc;
      },
      { totalPaid: 0, totalUnpaid: 0 }
    );
  }, [tableData]);

  const handlePrint = () => {
    window.print();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Print Configuration for Global Component
  const printColumns = [
    { key: 'sl', label: 'SL', align: 'center' },
    { key: 'date', label: 'ORDER DATE', align: 'left' },
    { key: 'desc', label: 'DESCRIPTION / ORDER ID', align: 'left' },
    { key: 'billed', label: 'TOTAL BILL', align: 'right' },
    { key: 'paid', label: 'PAID AMOUNT', align: 'right' },
    { key: 'due', label: 'UNPAID (DUE)', align: 'right' },
  ];

  const printRows = tableData.map((item, idx) => {
    const due = Number(item.dueAmount) || 0;
    const paid = Number(item.paidAmount) || 0;
    const total = Number(item.grandTotal) || (paid + due);

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
    { label: 'OPENING BALANCE', value: `৳${OPENING_BALANCE.toLocaleString()}` },
    { label: 'TOTAL BILLED', value: `৳${(totalPaid + totalUnpaid).toLocaleString()}` },
    { label: 'TOTAL PAID', value: `৳${totalPaid.toLocaleString()}` },
    { label: 'TOTAL DUE / UNPAID', value: `৳${totalUnpaid.toLocaleString()}`, isBold: true },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 p-4 md:p-8 font-sans relative">
      {/* Toast */}
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4 print:hidden">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Client Statement
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Detailed delivery statements and account balance breakdown
            </p>
          </div>
          {isSearched && (
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Statement
            </button>
          )}
        </div>

        {/* Filter Section */}
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
            autoAddress={autoAddress}
            filteredCustomers={filteredCustomers}
            handleSearch={handleSearch}
          />
        </div>

        {/* Screen View */}
        {isSearched && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl w-full print:hidden">
            <ClientStatementTable
              tableData={tableData}
              paymentStatus={paymentStatus}
              openingBalance={OPENING_BALANCE}
              onViewOrder={handleViewOrder}
            />

            <ClientStatementSummary
              paymentStatus={paymentStatus}
              totalPaid={totalPaid}
              totalUnpaid={totalUnpaid}
              openingBalance={OPENING_BALANCE}
            />
          </div>
        )}

        {/* Global Bank-Style Print Component (Visible ONLY on print) */}
        {isSearched && (
          <GlobalStatementPrint
            companyName="MEDIDENT"
            companyAddress="Mirpur, Dhaka, Bangladesh"
            reportTitle="CLIENT ACCOUNT STATEMENT"
            clientInfo={{
              name: selectedCustomerObj?.name || "",
              address: autoAddress,
              accountId: selectedCustomer?.slice(-8).toUpperCase() || "",
            }}
            metaInfo={{
              periodFrom: fromDate,
              periodTo: toDate,
              currency: "Bangladeshi Taka (BDT)",
              statusFilter: paymentStatus,
            }}
            columns={printColumns}
            rows={printRows}
            openingBalanceRow={{
              desc: "STATEMENT OPENING BALANCE",
              due: `৳${OPENING_BALANCE.toLocaleString()}`,
            }}
            summaryRows={printSummary}
          />
        )}
      </div>

      {/* Readonly Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Order Details (Readonly)</h3>
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
                  <p className="text-xs text-slate-400 font-bold">Grand Total</p>
                  <p className="font-semibold text-slate-800">৳{selectedOrder.grandTotal || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">Paid Amount</p>
                  <p className="font-semibold text-emerald-600">৳{selectedOrder.paidAmount || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">Due Amount</p>
                  <p className="font-semibold text-rose-600">৳{selectedOrder.dueAmount || 0}</p>
                </div>
              </div>

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
                            {prod.product?.name || prod.product || "Product Item"}
                          </td>
                          <td className="p-3 text-center">{prod.quantity || prod.orderQty || 1}</td>
                          <td className="p-3 text-right">৳{prod.unitPrice || 0}</td>
                          <td className="p-3 text-right font-bold">৳{prod.afterDiscount || prod.totalPrice || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
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

      {/* Global Print CSS */}
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