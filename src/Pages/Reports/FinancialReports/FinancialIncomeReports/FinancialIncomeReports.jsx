import { useState, useEffect } from 'react';
import FinancialReportDateFilter from './FinancialReportDateFilter';
import FinancialIncomeReportTable from './FinancialIncomeReportTable';

const FinancialIncomeReports = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Fetch JSON data from public folder
  useEffect(() => {
    fetch('/paymentsData.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAllPayments(data);
        setFilteredReports(data); // পেজ লোডে সমস্ত ডাটা ইনিশিয়ালি শো করার জন্য
      })
      .catch((err) => console.error('Error fetching payments data:', err));
  }, []);

  // Filter automatically when fromDate, toDate or allPayments change
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      const filtered = allPayments.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });

      setFilteredReports(filtered);
    } else if (!fromDate && !toDate) {
      setFilteredReports(allPayments);
    }
  }, [fromDate, toDate, allPayments]);

  // Calculate total sum of filtered amounts
  const totalAmount = filteredReports.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Income Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select date range to view invoice reports automatically
        </p>
      </div>

      <FinancialReportDateFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <FinancialIncomeReportTable
        reports={filteredReports}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default FinancialIncomeReports;