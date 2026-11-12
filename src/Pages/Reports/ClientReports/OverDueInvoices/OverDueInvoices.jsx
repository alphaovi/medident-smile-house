import { useState, useEffect, useMemo } from 'react';
import ReportHeader from './ReportHeader';
import ReportFilters from './ReportFilters';
import OverdueTable from './OverdueTable';

const OverDueInvoices = () => {
  const [reports, setReports] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load public/reportData.json
  useEffect(() => {
    fetch('/reportData.json')
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report data:', err);
        setLoading(false);
      });
  }, []);

  // Generate dynamic dropdown values from data
  const states = useMemo(() => {
    return [...new Set(reports.map((item) => item.state).filter(Boolean))];
  }, [reports]);

  const clinics = useMemo(() => {
    return [
      ...new Set(
        reports
          .filter((item) => !selectedState || item.state === selectedState)
          .map((item) => item.clinicName)
          .filter(Boolean)
      )
    ];
  }, [reports, selectedState]);

  const doctors = useMemo(() => {
    return [
      ...new Set(
        reports
          .filter((item) => !selectedClinic || item.clinicName === selectedClinic)
          .map((item) => item.doctorName)
          .filter(Boolean)
      )
    ];
  }, [reports, selectedClinic]);

  // Combined Overdue & Filter calculation
  const filteredReports = useMemo(() => {
    if (!reports.length) return [];

    const currentDate = new Date();

    return reports.filter((item) => {
      // 1. Must have an outstanding balance
      if (Number(item.dueAmount) <= 0) return false;

      // 2. State filter
      if (selectedState && item.state !== selectedState) return false;

      // 3. Clinic filter
      if (selectedClinic && item.clinicName !== selectedClinic) return false;

      // 4. Doctor filter
      if (selectedDoctor && item.doctorName !== selectedDoctor) return false;

      // 5. Overdue Month calculation based on deliveryDate
      const deliveryDate = new Date(item.deliveryDate);
      const cutoffDate = new Date();
      cutoffDate.setMonth(currentDate.getMonth() - selectedMonths);

      return deliveryDate <= cutoffDate;
    });
  }, [reports, selectedState, selectedClinic, selectedDoctor, selectedMonths]);

  const handleResetFilters = () => {
    setSelectedState('');
    setSelectedClinic('');
    setSelectedDoctor('');
    setSelectedMonths(1);
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ReportHeader
          title="Overdue Accounts Report"
          subtitle="Filter outstanding balances by State, Clinic, Doctor, and Overdue Age"
          totalRecords={filteredReports.length}
        />

        <ReportFilters
          states={states}
          clinics={clinics}
          doctors={doctors}
          selectedState={selectedState}
          selectedClinic={selectedClinic}
          selectedDoctor={selectedDoctor}
          selectedMonths={selectedMonths}
          onStateChange={setSelectedState}
          onClinicChange={setSelectedClinic}
          onDoctorChange={setSelectedDoctor}
          onMonthChange={setSelectedMonths}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-slate-500 font-medium animate-pulse text-sm">
              Loading report data...
            </div>
          </div>
        ) : (
          <OverdueTable reports={filteredReports} />
        )}
      </div>
    </div>
  );
};

export default OverDueInvoices;