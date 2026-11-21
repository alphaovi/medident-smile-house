import { Link } from "react-router";

const ExpenseListFilter = ({
  selectedHead,
  setSelectedHead,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  searchTerm,
  setSearchTerm,
  headOptions = [],
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 uppercase tracking-wide">
            Expense List
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, filter, and approve organization expenses
          </p>
        </div>
        <div>
          <Link to="/accounts/expense/add-expenses">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer">
              + Add New Expense
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center pt-2">
        {/* Select Expense Head */}
        <div>
          <select
            value={selectedHead}
            onChange={(e) => setSelectedHead(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 bg-amber-400 text-slate-900 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
          >
            <option value="ALL">Expense Head (All)</option>
            {headOptions.map((head, idx) => (
              <option key={idx} value={head}>
                {head}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div>
          <input
            type={fromDate ? "date" : "text"}
            onFocus={(e) => {
              e.target.type = "date";
              if (e.target.showPicker) e.target.showPicker();
            }}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            placeholder="FROM DATE"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 bg-amber-400 font-bold text-xs text-slate-900 outline-none cursor-pointer placeholder-slate-700 uppercase"
          />
        </div>

        {/* To Date */}
        <div>
          <input
            type={toDate ? "date" : "text"}
            onFocus={(e) => {
              e.target.type = "date";
              if (e.target.showPicker) e.target.showPicker();
            }}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            placeholder="TO DATE"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-2.5 bg-amber-400 font-bold text-xs text-slate-900 outline-none cursor-pointer placeholder-slate-700 uppercase"
          />
        </div>

        {/* Search Input */}
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SEARCH BY ID, HEAD, NOTE..."
            className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseListFilter;