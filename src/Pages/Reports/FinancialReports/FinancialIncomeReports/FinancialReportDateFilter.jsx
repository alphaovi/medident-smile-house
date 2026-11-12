import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FinancialReportDateFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Date Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            From Date
          </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => onFromDateChange(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700 cursor-pointer"
          />
        </div>

        {/* To Date Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            To Date
          </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => onToDateChange(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialReportDateFilter;