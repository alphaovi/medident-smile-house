import { useMemo, useRef } from "react";

const Filters = ({
  data = [],
  startDate,
  endDate,
  filters,
  onDateChange,
  onFilterChange,
  uniqueStates = [],
  uniqueStatuses = [],
}) => {
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  // Available Clinics
  const availableClinics = useMemo(() => {
    return Array.from(
      new Map(
        data
          .filter((item) => !filters.state || item.state === filters.state)
          .map((item) => [item.clinicId, item])
      ).values()
    );
  }, [data, filters.state]);

  // Available Doctors
  const availableDoctors = useMemo(() => {
    return Array.from(
      new Map(
        data
          .filter((item) => {
            if (filters.state && item.state !== filters.state) return false;
            if (filters.clinic && String(item.clinicId) !== String(filters.clinic)) return false;
            return true;
          })
          .map((item) => [item.doctorId, item])
      ).values()
    );
  }, [data, filters.state, filters.clinic]);

  const selectClass =
    "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer hover:border-gray-300";

  // YYYY-MM-DD -> DD/MM/YYYY Conversion Function
  const formatToDDMMYYYY = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-4">
      {/* ================= DATE FILTER (DD/MM/YYYY) ================= */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">
          Date Filter
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* From Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              From Date
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder="DD/MM/YYYY"
                value={formatToDDMMYYYY(startDate)}
                onClick={() => startPickerRef.current?.showPicker?.()}
                className={`${selectClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => startPickerRef.current?.showPicker?.()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                📅
              </button>
              <input
                ref={startPickerRef}
                type="date"
                value={startDate || ""}
                max={endDate || undefined}
                onChange={(e) => onDateChange("startDate", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                style={{ zIndex: -1 }}
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              To Date
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder="DD/MM/YYYY"
                value={formatToDDMMYYYY(endDate)}
                onClick={() => endPickerRef.current?.showPicker?.()}
                className={`${selectClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => endPickerRef.current?.showPicker?.()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                📅
              </button>
              <input
                ref={endPickerRef}
                type="date"
                value={endDate || ""}
                min={startDate || undefined}
                onChange={(e) => onDateChange("endDate", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                style={{ zIndex: -1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY FILTERS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange("state", e.target.value)}
            className={selectClass}
          >
            <option value="">All States</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className={selectClass}
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Clinic Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Clinic Name
          </label>
          <select
            value={filters.clinic}
            onChange={(e) => onFilterChange("clinic", e.target.value)}
            className={selectClass}
          >
            <option value="">All Clinics</option>
            {availableClinics.map((cl) => (
              <option key={cl.clinicId} value={cl.clinicId}>
                {cl.clinicName}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Doctor Name
          </label>
          <select
            value={filters.doctor}
            onChange={(e) => onFilterChange("doctor", e.target.value)}
            className={selectClass}
          >
            <option value="">All Doctors</option>
            {availableDoctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                {doc.doctorName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;