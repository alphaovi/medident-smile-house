import  { useState, useMemo } from 'react';
import LedgerFilterBar from './LedgerFilterBar';
import LedgerTable from './LedgerTable';

// Import JSON Report Data
import initialReportData from '../../../../../public/reportData.json';

const ClientLedger = () => {
  // Filter States
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedClinic, setSelectedClinic] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');

  // Dynamic Options for State Dropdown
  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(initialReportData.map((item) => item.state)));
    return ['ALL', ...states];
  }, []);

  // Dynamic Options for Clinic Dropdown based on Selected State
  const clinicOptions = useMemo(() => {
    let filtered = initialReportData;
    if (selectedState !== 'ALL') {
      filtered = filtered.filter((item) => item.state === selectedState);
    }
    const uniqueClinics = Array.from(
      new Set(filtered.map((item) => JSON.stringify({ id: item.clinicId, name: item.clinicName })))
    ).map((str) => JSON.parse(str));

    return [{ id: 'ALL', name: 'All Clinics' }, ...uniqueClinics];
  }, [selectedState]);

  // Dynamic Options for Doctor Dropdown based on Selected Clinic & State
  const doctorOptions = useMemo(() => {
    let filtered = initialReportData;
    if (selectedState !== 'ALL') {
      filtered = filtered.filter((item) => item.state === selectedState);
    }
    if (selectedClinic !== 'ALL') {
      filtered = filtered.filter((item) => item.clinicId === selectedClinic);
    }
    const uniqueDoctors = Array.from(
      new Set(filtered.map((item) => JSON.stringify({ id: item.doctorId, name: item.doctorName })))
    ).map((str) => JSON.parse(str));

    return [{ id: 'ALL', name: 'All Doctors' }, ...uniqueDoctors];
  }, [selectedState, selectedClinic]);

  // Main Filter Logic
  const filteredLedgerData = useMemo(() => {
    return initialReportData.filter((item) => {
      // Date Range Filter
      if (fromDate && new Date(item.date) < new Date(fromDate)) return false;
      if (toDate && new Date(item.date) > new Date(toDate)) return false;

      // Dropdown Filters
      if (selectedState !== 'ALL' && item.state !== selectedState) return false;
      if (selectedClinic !== 'ALL' && item.clinicId !== selectedClinic) return false;
      if (selectedDoctor !== 'ALL' && item.doctorId !== selectedDoctor) return false;

      return true;
    });
  }, [fromDate, toDate, selectedState, selectedClinic, selectedDoctor]);

  // Get details of selected clinic when single clinic is selected
  const selectedClinicDetails = useMemo(() => {
    if (selectedClinic === 'ALL') return null;
    return clinicOptions.find((c) => c.id === selectedClinic);
  }, [selectedClinic, clinicOptions]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Client Ledger Report</h1>
        <p className="text-sm text-slate-500">
          Filter and manage clinic and doctor accounts, work history, payments, and outstanding balances.
        </p>
      </div>

      {/* Filter Component */}
      <LedgerFilterBar
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

      {/* Table Component */}
      <LedgerTable
        ledgerData={filteredLedgerData}
        isSingleClinicSelected={selectedClinic !== 'ALL'}
        selectedClinicDetails={selectedClinicDetails}
      />
    </div>
  );
};

export default ClientLedger;