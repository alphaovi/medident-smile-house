const TechnicianLedgerHeader = ({ technicians, selectedTechnicianId, onSelectTechnician }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Technician Ledger
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Real-time aggregate report of verified technician activities
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">Select Technician:</label>
        <select
          value={selectedTechnicianId}
          onChange={(e) => onSelectTechnician(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
        >
          {technicians.map((technician) => (
            <option key={technician.technicianId} value={technician.technicianId}>
              {technician.name} ({technician.technicianId})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TechnicianLedgerHeader;