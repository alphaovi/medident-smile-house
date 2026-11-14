import { useState, useEffect, useMemo } from 'react';
import LedgerFilterBar from './LedgerFilterBar';
import LedgerTable from './LedgerTable';
import { Loader2, AlertCircle, Printer } from 'lucide-react';

const ClientLedger = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";

  const [salesOrders, setSalesOrders] = useState([]);
  const [sellReturns, setSellReturns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter States (From Date, To Date, State, Customer)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState('ALL');

  // 1. ডাটাবেজ থেকে sales-orders, sell-returns এবং customers ডেটা প্যারাレルলি লোড
  useEffect(() => {
    const fetchLedgerData = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, returnsRes, custRes] = await Promise.all([
          fetch(`${BASE_URL}/sales-orders`),
          fetch(`${BASE_URL}/sell-returns`),
          fetch(`${BASE_URL}/customers`),
        ]);

        const ordersData = await ordersRes.json();
        const returnsData = await returnsRes.json();
        const custData = await custRes.json();

        const ordersList = Array.isArray(ordersData) ? ordersData : (ordersData.data || ordersData.result || []);
        setSalesOrders(ordersList);
        setSellReturns(Array.isArray(returnsData) ? returnsData : (returnsData.data || returnsData.result || []));
        setCustomers(Array.isArray(custData) ? custData : (custData.data || custData.result || []));

        // কোম্পানি ইনফো সেলস অর্ডার বা প্রথম অর্ডার থেকে সেট করা
        if (ordersList.length > 0 && ordersList[0].company) {
          setCompanyInfo({
            name: ordersList[0].company.name || 'MEDIDENT',
            address: ordersList[0].company.address || 'Mirpur, Dhaka, Bangladesh',
            phone: ordersList[0].company.phone || '+880 1XXX-XXXXXX',
          });
        }
      } catch (err) {
        console.error('Error fetching ledger database records:', err);
        setToastMessage('Failed to load ledger data from database.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLedgerData();
  }, [BASE_URL]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // State অপশন তৈরি
  const stateOptions = useMemo(() => {
    const states = new Set();
    customers.forEach(c => { if (c.division || c.state) states.add(c.division || c.state); });
    salesOrders.forEach(o => { if (o.stateOrRegion || o.state) states.add(o.stateOrRegion || o.state); });
    return ['ALL', ...Array.from(states)];
  }, [customers, salesOrders]);

  // Customer অপশন তৈরি
  const customerOptions = useMemo(() => {
    return [{ id: 'ALL', name: 'All Customers' }, ...customers.map(c => ({ id: String(c._id || c.id), name: c.name }))];
  }, [customers]);

  // 2. 고객별 레저 계산 및 필터링 로직
  const processedLedgerData = useMemo(() => {
    const customerMap = {};

    customers.forEach((cust) => {
      const cId = String(cust._id || cust.id);
      customerMap[cId] = {
        customerId: cId,
        customId: cust.id || cId.slice(-6).toUpperCase(),
        customerName: cust.name || 'Unnamed Customer',
        srName: cust.sr?.name || cust.srName || 'N/A',
        state: cust.division || cust.state || 'Dhaka',
        sell: 0,
        paid: 0,
        preDue: 0,
        returnAmount: 0,
        grandTotal: 0,
      };
    });

    salesOrders.forEach((order) => {
      const cObj = order.customer;
      const cId = typeof cObj === 'object' ? String(cObj?._id || cObj?.id) : String(cObj);

      if (!cId) return;

      if (!customerMap[cId]) {
        customerMap[cId] = {
          customerId: cId,
          customId: cId.slice(-6).toUpperCase(),
          customerName: typeof cObj === 'object' ? (cObj.name || 'Unnamed Customer') : 'Unnamed Customer',
          srName: 'N/A',
          state: order.stateOrRegion || order.state || 'Dhaka',
          sell: 0,
          paid: 0,
          preDue: 0,
          returnAmount: 0,
          grandTotal: 0,
        };
      }

      const orderDate = order.orderDate ? new Date(order.orderDate) : null;
      const orderProducts = order.products || [];
      const orderSellTotal = orderProducts.reduce((sum, p) => sum + (Number(p.afterDiscount ?? p.totalPrice ?? 0)), 0);
      const orderPayments = order.payments || [];
      const orderPaidTotal = orderPayments.reduce((sum, pay) => sum + (Number(pay.amount ?? 0)), 0);

      const isBeforeFrom = fromDate && orderDate && orderDate < new Date(fromDate);
      const isWithinRange = (!fromDate || (orderDate && orderDate >= new Date(fromDate))) &&
                            (!toDate || (orderDate && orderDate <= new Date(toDate + 'T23:59:59')));

      if (isBeforeFrom) {
        customerMap[cId].preDue += (orderSellTotal - orderPaidTotal);
      } else if (isWithinRange || !fromDate) {
        customerMap[cId].sell += orderSellTotal;
        customerMap[cId].paid += orderPaidTotal;
      }
    });

    sellReturns.forEach((ret) => {
      const cObj = ret.customer;
      const cId = typeof cObj === 'object' ? String(cObj?._id || cObj?.id) : String(cObj);

      if (!cId || !customerMap[cId]) return;

      const retDate = ret.createdAt || ret.date ? new Date(ret.createdAt || ret.date) : null;
      const retAmount = Number(ret.totalAmount || ret.refundAmount || 0);

      const isBeforeFrom = fromDate && retDate && retDate < new Date(fromDate);
      const isWithinRange = (!fromDate || (retDate && retDate >= new Date(fromDate))) &&
                            (!toDate || (retDate && retDate <= new Date(toDate + 'T23:59:59')));

      if (isBeforeFrom) {
        customerMap[cId].preDue -= retAmount;
      } else if (isWithinRange || !fromDate) {
        customerMap[cId].returnAmount += retAmount;
      }
    });

    let result = Object.values(customerMap).map((item) => {
      const totalActiveBalance = (item.preDue + item.sell) - item.returnAmount;
      const grandTotal = Math.max(0, totalActiveBalance - item.paid);
      return { ...item, grandTotal };
    }).filter(item => item.sell > 0 || item.preDue > 0 || item.paid > 0 || item.returnAmount > 0);

    // স্টেট ও কাস্টমার ফিল্টার প্রয়োগ
    if (selectedState !== 'ALL') {
      result = result.filter(item => item.state === selectedState);
    }
    if (selectedCustomer !== 'ALL') {
      result = result.filter(item => item.customerId === selectedCustomer);
    }

    return result;
  }, [salesOrders, sellReturns, customers, fromDate, toDate, selectedState, selectedCustomer]);

  // প্রিন্ট হ্যান্ডলার
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // টোটাল সামারি হিসাব
  const printTotals = processedLedgerData.reduce(
    (acc, curr) => ({
      sell: acc.sell + curr.sell,
      paid: acc.paid + curr.paid,
      preDue: acc.preDue + curr.preDue,
      returnAmount: acc.returnAmount + curr.returnAmount,
      grandTotal: acc.grandTotal + curr.grandTotal,
    }),
    { sell: 0, paid: 0, preDue: 0, returnAmount: 0, grandTotal: 0 }
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-rose-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce print:hidden">
          <AlertCircle className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:bg-rose-700 p-1 rounded-lg cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header Section with Print Button */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4 print:hidden mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Client Ledger Report</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor sales, previous dues, payments, and returns directly from database sales orders.
          </p>
        </div>
        {!isLoading && processedLedgerData.length > 0 && (
          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Ledger Report
          </button>
        )}
      </div>

      {/* Filter Component */}
      <div className="w-full print:hidden">
        <LedgerFilterBar
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          stateOptions={stateOptions}
          customerOptions={customerOptions}
        />
      </div>

      {/* Loading State or Table Component */}
      {isLoading ? (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-20 flex flex-col items-center justify-center shadow-sm print:hidden">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-600 font-semibold text-sm">Loading client ledger from database...</p>
        </div>
      ) : (
        <div className="w-full print:hidden">
          <LedgerTable ledgerData={processedLedgerData} />
        </div>
      )}

      {/* Custom Print-Only Layout with Full-Row Summary (Does not affect GlobalStatementPrint) */}
      {!isLoading && processedLedgerData.length > 0 && (
        <div className="hidden print:block print:w-full print:bg-white print:text-black font-sans text-xs">
          {/* Top Header: Company Info */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-4">
            <div className="space-y-1 max-w-[50%]">
              <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                {selectedState !== 'ALL' ? selectedState : 'ALL STATES'}
              </h2>
            </div>

            <div className="text-right space-y-1 max-w-[45%]">
              <h1 className="text-lg font-black uppercase tracking-wider text-slate-900">
                {companyInfo.name || "MEDIDENT"}
              </h1>
              <p className="text-[11px] text-slate-700">{companyInfo.address || "Mirpur, Dhaka, Bangladesh"}</p>
              <p className="text-[11px] text-slate-700">{companyInfo.phone || "+880 1XXX-XXXXXX"}</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-8 mb-5 text-[11px] border-b border-slate-300 pb-4">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Customer Name</span>
                <span className="font-extrabold uppercase">: {selectedCustomer !== 'ALL' ? (customers.find(c => String(c._id || c.id) === selectedCustomer)?.name || '') : 'ALL CLIENTS'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Statement Period</span>
                <span>: {fromDate || 'Start'} to {toDate || 'Present'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Currency Name</span>
                <span>: Bangladeshi Taka (BDT)</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Print Date</span>
                <span>: {new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-800 inline-block pb-0.5">
              CLIENT LEDGER REPORT
            </h3>
          </div>

          {/* Table with Full Line Footer Summary */}
          <table className="w-full border-collapse border border-slate-400 text-[11px] mb-6">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <th className="p-2 border-r border-slate-400 text-left">CUSTOMER ID</th>
                <th className="p-2 border-r border-slate-400 text-left">CUSTOMER NAME</th>
                <th className="p-2 border-r border-slate-400 text-left">SR NAME</th>
                <th className="p-2 border-r border-slate-400 text-right">SELL (৳)</th>
                <th className="p-2 border-r border-slate-400 text-right">PAID (৳)</th>
                <th className="p-2 border-r border-slate-400 text-right">PRE DUE (৳)</th>
                <th className="p-2 border-r border-slate-400 text-right">RETURN (৳)</th>
                <th className="p-2 text-right">GRAND TOTAL (৳)</th>
              </tr>
            </thead>
            <tbody>
              {processedLedgerData.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-300">
                  <td className="p-2 border-r border-slate-300 text-left">{item.customId}</td>
                  <td className="p-2 border-r border-slate-300 text-left font-medium">{item.customerName}</td>
                  <td className="p-2 border-r border-slate-300 text-left">{item.srName}</td>
                  <td className="p-2 border-r border-slate-300 text-right">৳{item.sell.toLocaleString()}</td>
                  <td className="p-2 border-r border-slate-300 text-right">৳{item.paid.toLocaleString()}</td>
                  <td className="p-2 border-r border-slate-300 text-right">৳{item.preDue.toLocaleString()}</td>
                  <td className="p-2 border-r border-slate-300 text-right">৳{item.returnAmount.toLocaleString()}</td>
                  <td className="p-2 text-right font-bold">৳{item.grandTotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={3} className="p-2 border-r border-slate-400 text-right uppercase tracking-wider font-black">
                  TOTAL
                </td>
                <td className="p-2 border-r border-slate-400 text-right font-bold">৳{printTotals.sell.toLocaleString()}</td>
                <td className="p-2 border-r border-slate-400 text-right font-bold">৳{printTotals.paid.toLocaleString()}</td>
                <td className="p-2 border-r border-slate-400 text-right font-bold">৳{printTotals.preDue.toLocaleString()}</td>
                <td className="p-2 border-r border-slate-400 text-right font-bold">৳{printTotals.returnAmount.toLocaleString()}</td>
                <td className="p-2 text-right font-bold">৳{printTotals.grandTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="text-center mt-8 space-y-2">
            <p className="font-bold tracking-widest text-[11px] text-slate-800">
              -- END OF STATEMENT --
            </p>
            <p className="text-[10px] text-slate-600">
              Please note that any discrepancy must be notified within 15 days from the date of this statement.
            </p>
            <p className="text-[10px] font-semibold text-slate-800 pt-2 border-t border-slate-300">
              This is a computer generated statement and does not require any signature.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLedger;