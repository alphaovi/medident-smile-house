const TechnicianLedgerProfileCard = ({ technician }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
      <div>
        <span className="text-xs uppercase tracking-wider text-gray-500 block font-semibold">
          Technician Name
        </span>
        <span className="text-lg font-bold text-gray-900 mt-1 block">
          {technician.name}
        </span>
      </div>
      <div>
        <span className="text-xs uppercase tracking-wider text-gray-500 block font-semibold">
          Designation
        </span>
        <span className="text-lg font-medium text-blue-600 mt-1 block">
          {technician.designation}
        </span>
      </div>
      <div>
        <span className="text-xs uppercase tracking-wider text-gray-500 block font-semibold">
          Cases Supervised
        </span>
        <span className="text-xl font-black text-indigo-600 mt-1 block">
          {technician.casesSupervised}
        </span>
      </div>
    </div>
  );
};

export default TechnicianLedgerProfileCard;