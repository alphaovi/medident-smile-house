import { useState, useMemo } from "react";
import caseData from "../../../../../public/caseData.json";
import CaseHeader from "./CaseHeader";
import FilterBar from "./CaseFilterBar";
import CaseTable from "./CaseTable";

const CaseSummary = () => {
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-03-31");
  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedClinic, setSelectedClinic] = useState("ALL");
  const [selectedDoctor, setSelectedDoctor] = useState("ALL");

  // State Options
  const stateOptions = useMemo(() => {
    const states = caseData.map((d) => d.state);
    return ["ALL", ...new Set(states)];
  }, []);

  // Clinic Options based on State
  const clinicOptions = useMemo(() => {
    let filtered = caseData;
    if (selectedState !== "ALL") {
      filtered = filtered.filter((d) => d.state === selectedState);
    }
    const clinics = filtered.map((d) => ({
      id: d.clinicId,
      name: d.clinicName,
    }));
    const unique = Array.from(new Set(clinics.map((c) => c.id))).map((id) =>
      clinics.find((c) => c.id === id),
    );
    return [{ id: "ALL", name: "All Clinics" }, ...unique];
  }, [selectedState]);

  // Doctor Options based on State & Clinic
  const doctorOptions = useMemo(() => {
    let filtered = caseData;
    if (selectedState !== "ALL") {
      filtered = filtered.filter((d) => d.state === selectedState);
    }
    if (selectedClinic !== "ALL") {
      filtered = filtered.filter((d) => d.clinicId === selectedClinic);
    }
    const doctors = filtered.map((d) => ({
      id: d.doctorId,
      name: d.doctorName,
    }));
    const unique = Array.from(new Set(doctors.map((doc) => doc.id))).map((id) =>
      doctors.find((doc) => doc.id === id),
    );
    return [{ id: "ALL", name: "All Doctors" }, ...unique];
  }, [selectedState, selectedClinic]);

  // Filter Table Data
  const filteredData = useMemo(() => {
    return caseData.filter((item) => {
      const itemDate = new Date(item.deliveryDate);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      if (selectedState !== "ALL" && item.state !== selectedState) return false;
      if (selectedClinic !== "ALL" && item.clinicId !== selectedClinic)
        return false;
      if (selectedDoctor !== "ALL" && item.doctorId !== selectedDoctor)
        return false;

      return true;
    });
  }, [fromDate, toDate, selectedState, selectedClinic, selectedDoctor]);

  // Grouped Data by Doctor
  const groupedDataByDoctor = useMemo(() => {
    if (selectedDoctor !== "ALL") return [];

    const groupMap = {};
    filteredData.forEach((item) => {
      if (!groupMap[item.doctorId]) {
        groupMap[item.doctorId] = {
          doctorId: item.doctorId,
          doctorName: item.doctorName,
          clinicName: item.clinicName,
          totalAmount: 0,
          caseCount: 0,
        };
      }
      groupMap[item.doctorId].totalAmount +=
        item.amount || item.paidAmount || 0;
      groupMap[item.doctorId].caseCount += 1;
    });

    return Object.values(groupMap);
  }, [filteredData, selectedDoctor]);

  // Total Calculation
  const grandTotalAmount = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => acc + (item.amount || item.paidAmount || 0),
      0,
    );
  }, [filteredData]);

  const isSingleDoctorMode = selectedDoctor !== "ALL";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Component */}
        <CaseHeader />

        {/* Filter Toolbar Component */}
        <FilterBar
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedClinic={selectedClinic}
          setSelectedClinic={setSelectedClinic}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          stateOptions={stateOptions}
          clinicOptions={clinicOptions}
          doctorOptions={doctorOptions}
        />

        {/* Case Table Component */}
        <CaseTable
          isSingleDoctorMode={isSingleDoctorMode}
          filteredData={filteredData}
          groupedDataByDoctor={groupedDataByDoctor}
          grandTotalAmount={grandTotalAmount}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>
    </div>
  );
};

export default CaseSummary;
