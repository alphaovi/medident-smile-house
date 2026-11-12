const ReportHeader = ({ title, subtitle, totalRecords }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          Total Overdue: <strong className="text-blue-600 font-bold">{totalRecords}</strong>
        </span>
      </div>
    </div>
  );
};

export default ReportHeader;