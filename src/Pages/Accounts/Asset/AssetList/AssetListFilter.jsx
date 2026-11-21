// components/AssetListFilter.jsx


const AssetListFilter = ({
  selectedHead,
  setSelectedHead,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  searchTerm,
  setSearchTerm,
  headOptions,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Filter Asset Head
        </label>
        <select
          value={selectedHead}
          onChange={(e) => setSelectedHead(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Heads</option>
          {headOptions.map((head, index) => (
            <option key={index} value={head}>
              {head}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          From Date
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          To Date
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Global Search
        </label>
        <input
          type="text"
          placeholder="Search ID, Notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default AssetListFilter;