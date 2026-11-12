import  { useState, useMemo } from "react";
import { mockReportData } from "./mockData";
import PaymentFilters from "./PaymentFilters";
import PaymentTable from "./PaymentTable";

const PaymentSummaryNew = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [filters, setFilters] = useState({
    state: "",
    clinic: "",
    doctor: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "state") {
        updated.clinic = "";
        updated.doctor = "";
      }

      if (key === "clinic") {
        if (value) {
          const matchingDoctors = mockReportData.filter(
            (item) => String(item.clinicId) === String(value)
          );
          const uniqueDoctorsInClinic = Array.from(
            new Set(matchingDoctors.map((d) => d.doctorId))
          );

          if (uniqueDoctorsInClinic.length === 1) {
            updated.doctor = uniqueDoctorsInClinic[0];
          } else {
            updated.doctor = "";
          }

          if (!updated.state && matchingDoctors.length > 0) {
            updated.state = matchingDoctors[0].state;
          }
        } else {
          updated.doctor = "";
        }
      }

      if (key === "doctor") {
        if (value) {
          const match = mockReportData.find(
            (item) => String(item.doctorId) === String(value)
          );
          if (match) {
            updated.clinic = match.clinicId;
            updated.state = match.state;
          }
        }
      }

      return updated;
    });
  };

  const handleDateChange = (type, val) => {
    if (type === "startDate") setStartDate(val);
    if (type === "endDate") setEndDate(val);
  };

  const uniqueStates = useMemo(() => {
    return Array.from(new Set(mockReportData.map((i) => i.state).filter(Boolean)));
  }, []);

  const availableClinics = useMemo(() => {
    const list = filters.state
      ? mockReportData.filter((i) => i.state === filters.state)
      : mockReportData;

    return Array.from(
      new Map(list.map((item) => [item.clinicId, { clinicId: item.clinicId, clinicName: item.clinicName }])).values()
    );
  }, [filters.state]);

  const availableDoctors = useMemo(() => {
    let list = mockReportData;
    if (filters.clinic) {
      list = mockReportData.filter((i) => String(i.clinicId) === String(filters.clinic));
    } else if (filters.state) {
      list = mockReportData.filter((i) => i.state === filters.state);
    }

    return Array.from(
      new Map(list.map((item) => [item.doctorId, { doctorId: item.doctorId, doctorName: item.doctorName }])).values()
    );
  }, [filters.state, filters.clinic]);

  const autoAddress = useMemo(() => {
    if (filters.doctor) {
      const match = mockReportData.find((i) => String(i.doctorId) === String(filters.doctor));
      if (match) return match.address;
    }
    if (filters.clinic) {
      const match = mockReportData.find((i) => String(i.clinicId) === String(filters.clinic));
      if (match) return match.address;
    }
    return "";
  }, [filters.clinic, filters.doctor]);

  const filteredData = useMemo(() => {
    return mockReportData.filter((item) => {
      const itemDate = item.paymentDate || item.deliveryDate;

      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;

      if (filters.state && item.state !== filters.state) return false;
      if (filters.clinic && String(item.clinicId) !== String(filters.clinic)) return false;
      if (filters.doctor && String(item.doctorId) !== String(filters.doctor)) return false;

      return true;
    });
  }, [startDate, endDate, filters]);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilters({ state: "", clinic: "", doctor: "" });
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Doctor Payment Summary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Filter payments by date range, state, clinic, and doctor.
          </p>
        </div>

        <PaymentFilters
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          uniqueStates={uniqueStates}
          availableClinics={availableClinics}
          availableDoctors={availableDoctors}
          autoAddress={autoAddress}
          onReset={handleReset}
        />

        <PaymentTable
          data={filteredData}
          isSingleDoctorSelected={Boolean(filters.doctor)}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
};

export default PaymentSummaryNew;