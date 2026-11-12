import { useState, useEffect, useMemo } from "react";
import Filters from "./Filters";
import SummaryTable from "./SummaryTable";

const WorkSummary = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filters State
  const [filters, setFilters] = useState({
    state: "",
    status: "",
    clinic: "",
    doctor: "",
  });

  // Fetch report data on component mount
  useEffect(() => {
    fetch("/report.json")
      .then((res) => res.json())
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading report data:", err);
        setLoading(false);
      });
  }, []);

  // Handle filter state updates and dependent dropdown logic
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "state") {
        updated.clinic = "";
        updated.doctor = "";
      }

      if (key === "clinic") {
        if (value) {
          const match = reportData.find((item) => String(item.clinicId) === String(value));
          if (match) updated.doctor = match.doctorId;
        } else {
          updated.doctor = "";
        }
      }

      if (key === "doctor") {
        if (value) {
          const match = reportData.find((item) => String(item.doctorId) === String(value));
          if (match) updated.clinic = match.clinicId;
        } else {
          updated.clinic = "";
        }
      }

      return updated;
    });
  };

  // Handle date input changes
  const handleDateChange = (type, val) => {
    if (type === "startDate") setStartDate(val);
    if (type === "endDate") setEndDate(val);
  };

  // Unique lists for dropdowns
  const uniqueStates = useMemo(
    () => Array.from(new Set(reportData.map((i) => i.state).filter(Boolean))),
    [reportData]
  );

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(reportData.map((i) => i.status).filter(Boolean))),
    [reportData]
  );

  // Safe Date Comparator Parser
  const parseSafeDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    }
    const parsed = new Date(dateStr).getTime();
    return isNaN(parsed) ? null : parsed;
  };

  // Filter dataset based on selected options
  const filteredData = useMemo(() => {
    const startTimestamp = parseSafeDate(startDate);
    const endTimestamp = parseSafeDate(endDate);

    return reportData.filter((item) => {
      // Date filter logic
      if (item.date) {
        const itemTimestamp = parseSafeDate(item.date);

        if (itemTimestamp) {
          if (startTimestamp && itemTimestamp < startTimestamp) return false;
          if (endTimestamp && itemTimestamp > endTimestamp) return false;
        }
      }

      // Dropdown filters
      if (filters.state && item.state !== filters.state) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.clinic && String(item.clinicId) !== String(filters.clinic)) return false;
      if (filters.doctor && String(item.doctorId) !== String(filters.doctor)) return false;

      return true;
    });
  }, [reportData, startDate, endDate, filters]);

  // Reset all filters
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilters({ state: "", status: "", clinic: "", doctor: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 font-medium animate-pulse">
          Loading report details...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Work Summary Report
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Filter and analyze orders by dates, status, clinics, and doctors.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition-colors duration-200"
          >
            Reset Filters
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
          <Filters
            data={reportData}
            startDate={startDate}
            endDate={endDate}
            filters={filters}
            onDateChange={handleDateChange}
            onFilterChange={handleFilterChange}
            uniqueStates={uniqueStates}
            uniqueStatuses={uniqueStatuses}
          />
        </div>

        {/* Table */}
        <SummaryTable reportData={filteredData} />
      </div>
    </div>
  );
};

export default WorkSummary;