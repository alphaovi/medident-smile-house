const ReportFilters = ({
  states,
  clinics,
  doctors,
  selectedState,
  selectedClinic,
  selectedDoctor,
  selectedMonths,
  onStateChange,
  onClinicChange,
  onDoctorChange,
  onMonthChange,
  onReset
}) => {
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 mb-6 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* State Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          >
            <option value="">All States</option>
            {states.map((state, idx) => (
              <option key={idx} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Clinic Name Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Clinic Name
          </label>
          <select
            value={selectedClinic}
            onChange={(e) => onClinicChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          >
            <option value="">All Clinics</option>
            {clinics.map((clinic, idx) => (
              <option key={idx} value={clinic}>{clinic}</option>
            ))}
          </select>
        </div>

        {/* Doctor Name Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Doctor Name
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          >
            <option value="">All Doctors</option>
            {doctors.map((doc, idx) => (
              <option key={idx} value={doc}>{doc}</option>
            ))}
          </select>
        </div>

        {/* Overdue Month Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Overdue Threshold
          </label>
          <select
            value={selectedMonths}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                Older than {m} {m === 1 ? 'Month' : 'Months'}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;