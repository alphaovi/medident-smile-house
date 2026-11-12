import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FinancialExpenseFilter = ({
  fromDate,
  toDate,
  selectedGroup,
  selectedSubGroup,
  groups,
  subGroups,
  onFromDateChange,
  onToDateChange,
  onGroupChange,
  onSubGroupChange
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* From Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            From Date
          </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => onFromDateChange(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700 transition-all cursor-pointer"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            To Date
          </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => onToDateChange(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700 transition-all cursor-pointer"
          />
        </div>

        {/* Group Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Group
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700 transition-all cursor-pointer"
          >
            <option value="">All Groups</option>
            {groups.map((group, idx) => (
              <option key={idx} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Group Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sub Group
          </label>
          <select
            value={selectedSubGroup}
            onChange={(e) => onSubGroupChange(e.target.value)}
            disabled={!selectedGroup}
            className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700 transition-all cursor-pointer disabled:bg-slate-100/60 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedGroup ? 'All Sub Groups' : 'Select Group First'}
            </option>
            {subGroups.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

export default FinancialExpenseFilter;