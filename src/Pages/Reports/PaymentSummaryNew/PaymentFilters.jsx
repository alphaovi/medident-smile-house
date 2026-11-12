

const PaymentFilters = ({
  startDate,
  endDate,
  onDateChange,
  filters,
  onFilterChange,
  uniqueStates,
  availableClinics,
  availableDoctors,
  autoAddress,
  onReset,
}) => {
  // YYYY-MM-DD ফরম্যাটকে DD/MM/YYYY-এ কনভার্ট করার ফাংশন
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return "";
    return `${day}/${month}/${year}`;
  };

  // ক্লিক করলেই ক্যালেন্ডার ওপেন করার ট্রিপার
  const handlePickerTrigger = (e) => {
    const input = e.currentTarget.querySelector("input[type='date']");
    if (input && typeof input.showPicker === "function") {
      input.showPicker();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Filter Payment Records
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* FROM DATE */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            From Date
          </label>
          <div
            onClick={handlePickerTrigger}
            className="relative w-full flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
          >
            <span className="text-xs font-medium text-slate-700">
              {startDate ? formatDateToDDMMYYYY(startDate) : "dd/mm/yyyy"}
            </span>
            <svg className="w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateChange("startDate", e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
          </div>
        </div>

        {/* TO DATE */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            To Date
          </label>
          <div
            onClick={handlePickerTrigger}
            className="relative w-full flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
          >
            <span className="text-xs font-medium text-slate-700">
              {endDate ? formatDateToDDMMYYYY(endDate) : "dd/mm/yyyy"}
            </span>
            <svg className="w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateChange("endDate", e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
          </div>
        </div>

        {/* STATE FILTER */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange("state", e.target.value)}
            className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="">All States</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* CLINIC FILTER */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Clinic
          </label>
          <select
            value={filters.clinic}
            onChange={(e) => onFilterChange("clinic", e.target.value)}
            className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="">All Clinics</option>
            {availableClinics.map((c) => (
              <option key={c.clinicId} value={c.clinicId}>{c.clinicName}</option>
            ))}
          </select>
        </div>

        {/* DOCTOR FILTER */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Doctor
          </label>
          <select
            value={filters.doctor}
            onChange={(e) => onFilterChange("doctor", e.target.value)}
            className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="">
              {availableDoctors.length > 1 ? "All Doctors" : "Select Doctor"}
            </option>
            {availableDoctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>{d.doctorName}</option>
            ))}
          </select>
        </div>

        {/* ADDRESS (READ-ONLY) */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Address
          </label>
          <input
            type="text"
            readOnly
            placeholder="Auto Filled Address"
            value={autoAddress}
            className="w-full text-xs font-semibold p-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;