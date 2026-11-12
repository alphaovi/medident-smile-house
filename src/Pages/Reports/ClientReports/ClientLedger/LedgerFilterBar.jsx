
import { motion } from 'framer-motion';

/**
 * Filter Bar Component for Client Ledger
 * Provides date-range picker, state, clinic, and doctor select options.
 */
const LedgerFilterBar = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedState,
  setSelectedState,
  selectedClinic,
  setSelectedClinic,
  selectedDoctor,
  setSelectedDoctor,
  stateOptions,
  clinicOptions,
  doctorOptions,
}) => {

  // Helper function to convert ISO date (YYYY-MM-DD) to DD/MM/YYYY for display
  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Helper to trigger browser native date picker on full-box click
  const handleContainerClick = (e) => {
    const input = e.currentTarget.querySelector('input[type="date"]');
    if (input) {
      if (input.showPicker) {
        input.showPicker();
      } else {
        input.focus();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
    >
      {/* From Date Filter */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          From Date
        </label>
        <div
          onClick={handleContainerClick}
          className="relative w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg cursor-pointer flex items-center justify-between focus-within:ring-2 focus-within:ring-slate-400"
        >
          <span className={fromDate ? "text-slate-700" : "text-slate-400"}>
            {fromDate ? formatToDDMMYYYY(fromDate) : "dd/mm/yyyy"}
          </span>
          <svg className="w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="4" y1="11" x2="20" y2="11" />
          </svg>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
        </div>
      </div>

      {/* To Date Filter */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          To Date
        </label>
        <div
          onClick={handleContainerClick}
          className="relative w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg cursor-pointer flex items-center justify-between focus-within:ring-2 focus-within:ring-slate-400"
        >
          <span className={toDate ? "text-slate-700" : "text-slate-400"}>
            {toDate ? formatToDDMMYYYY(toDate) : "dd/mm/yyyy"}
          </span>
          <svg className="w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="4" y1="11" x2="20" y2="11" />
          </svg>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
        </div>
      </div>

      {/* State Selection */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          State / Region
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedClinic('ALL');
            setSelectedDoctor('ALL');
          }}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700"
        >
          {stateOptions.map((st) => (
            <option key={st} value={st}>
              {st === 'ALL' ? 'All States' : st}
            </option>
          ))}
        </select>
      </div>

      {/* Clinic Selection */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Clinic
        </label>
        <select
          value={selectedClinic}
          onChange={(e) => {
            setSelectedClinic(e.target.value);
            setSelectedDoctor('ALL');
          }}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700"
        >
          {clinicOptions.map((cl) => (
            <option key={cl.id} value={cl.id}>
              {cl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor Selection */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Doctor
        </label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-700"
        >
          {doctorOptions.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default LedgerFilterBar;