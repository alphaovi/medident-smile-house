

const LiabilityListFilter = ({
  selectedHead,
  setSelectedHead,
  selectedSubHead,
  setSelectedSubHead,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  searchTerm,
  setSearchTerm,
  headOptions = [],
  subHeadOptions = [],
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Head */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Head
        </label>
        <select
          value={selectedHead}
          onChange={(e) => {
            setSelectedHead(e.target.value);
            setSelectedSubHead("ALL");
          }}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Heads</option>
          {headOptions?.map((head, index) => (
            <option key={index} value={head}>
              {head}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Sub Head */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Sub Head
        </label>
        <select
          value={selectedSubHead}
          onChange={(e) => setSelectedSubHead(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Sub Heads</option>
          {subHeadOptions?.map((subHead, index) => (
            <option key={index} value={subHead}>
              {subHead}
            </option>
          ))}
        </select>
      </div>

      {/* 3. From Date */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          From Date
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 4. To Date */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          To Date
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 5. Global Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Global Search
        </label>
        <input
          type="text"
          placeholder="Search all..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default LiabilityListFilter;