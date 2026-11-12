import { useState, useEffect } from "react";
import LiabilityFilter from "./FinancialLiabilityFilter";
import LiabilityTable from "./FinancialLiabilityTable";

const FinancialLiabilityReports = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. JSON ডাটা ফেচ করা
  useEffect(() => {
    const fetchLiabilities = async () => {
      try {
        setLoading(true);
        const response = await fetch("/pendingLiabilities.json");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // শুধু যেসব আইটেমের Due Amount (totalAmount - paidAmount) > 0 সেগুলো আলাদা করা
        const pendingOnly = data.filter(
          (item) => (item.totalAmount || 0) - (item.paidAmount || 0) > 0,
        );

        setRawData(pendingOnly);
        setFilteredData(pendingOnly);
      } catch (error) {
        console.error("Error loading liability data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiabilities();
  }, []);

  // ২. Issue Date ধরে সঠিকভাবে ফিল্টার করার নিখুঁত লজিক
  useEffect(() => {
    let list = [...rawData];

    if (fromDate) {
      // DatePicker থেকে পাওয়া তারিখের YYYY-MM-DD ফরম্যাট তৈরি
      const fromStr = fromDate.toISOString().split("T")[0];
      list = list.filter((item) => item.issueDate && item.issueDate >= fromStr);
    }

    if (toDate) {
      // DatePicker থেকে পাওয়া তারিখের YYYY-MM-DD ফরম্যাট তৈরি
      const toStr = toDate.toISOString().split("T")[0];
      list = list.filter((item) => item.issueDate && item.issueDate <= toStr);
    }

    setFilteredData(list);
  }, [fromDate, toDate, rawData]);

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
  };

  // ৩. ফিল্টার হওয়া ডাটার টোটাল ডিউ হিসাব করা
  const totalDue = filteredData.reduce(
    (acc, curr) => acc + ((curr.totalAmount || 0) - (curr.paidAmount || 0)),
    0,
  );

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.title}>Pending Financial Liabilities</h1>
          <p style={styles.subtitle}>
            Track and manage outstanding dues by issue date
          </p>
        </div>

        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Total Payable Due:</span>
          <span style={styles.summaryAmount}>
            ৳ {totalDue.toLocaleString()}
          </span>
        </div>
      </div>

      <LiabilityFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onReset={handleReset}
      />

      <LiabilityTable data={filteredData} loading={loading} />
    </div>
  );
};

const styles = {
  container: { padding: "24px", fontFamily: "sans-serif" },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: { fontSize: "22px", fontWeight: "bold", color: "#212529", margin: 0 },
  subtitle: { fontSize: "13px", color: "#6c757d", margin: "4px 0 0 0" },
  summaryCard: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeeba",
    padding: "10px 16px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  summaryLabel: { fontSize: "12px", color: "#856404", fontWeight: "bold" },
  summaryAmount: { fontSize: "18px", color: "#856404", fontWeight: "bold" },
};

export default FinancialLiabilityReports;
