import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ startDate, endDate, onDateChange }) => {
  const selectClass =
    "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer";

  // YYYY-MM-DD স্ট্রিংকে Date অবজেক্টে রূপান্তর
  const parseDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

  // Date অবজেক্টকে YYYY-MM-DD স্ট্রিংয়ে রূপান্তর
  const formatISO = (date) => {
    if (!date) return "";
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
      {/* From Date */}
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          From Date
        </label>
        <DatePicker
          selected={parseDate(startDate)}
          onChange={(date) => onDateChange("startDate", formatISO(date))}
          dateFormat="dd/MM/yyyy"
          maxDate={parseDate(endDate)}
          placeholderText="DD/MM/YYYY"
          className={selectClass}
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          To Date
        </label>
        <DatePicker
          selected={parseDate(endDate)}
          onChange={(date) => onDateChange("endDate", formatISO(date))}
          dateFormat="dd/MM/yyyy"
          minDate={parseDate(startDate)}
          placeholderText="DD/MM/YYYY"
          className={selectClass}
        />
      </div>
    </div>
  );
};

export default DateFilter;