import {
  Calendar,
  UserCheck,
  Search,
  MapPin,
  DollarSign,
  PackageCheck,
} from "lucide-react";

const ClientFilterSection = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedCustomer,
  setSelectedCustomer,
  searchCustomerText,
  setSearchCustomerText,
  paymentStatus,
  setPaymentStatus,
  orderStatus,
  setOrderStatus,
  autoAddress,
  filteredCustomers,
  handleSearch,
}) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* FROM DATE */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" /> FROM DATE
          </label>
          <input
            type="date"
            value={fromDate}
            onClick={(e) => e.target.showPicker?.()}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          />
        </div>

        {/* TO DATE */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" /> TO DATE
          </label>
          <input
            type="date"
            value={toDate}
            onClick={(e) => e.target.showPicker?.()}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          />
        </div>

        {/* CUSTOMER SELECT & SEARCH */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" /> CUSTOMER ({filteredCustomers?.length || 0})
            </label>
            <div className="relative flex items-center">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name/ID..."
                value={searchCustomerText}
                onChange={(e) => setSearchCustomerText(e.target.value)}
                className="w-36 bg-slate-100 border border-slate-200 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="" disabled hidden>
              -- Select Customer --
            </option>
            {filteredCustomers?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.customId ? `(${c.customId})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* AUTO ADDRESS */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> ADDRESS (AUTO FILLED)
          </label>
          <input
            type="text"
            readOnly
            value={autoAddress}
            className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed italic"
          />
        </div>

        {/* PAYMENT STATUS */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" /> PAYMENT STATUS
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full bg-amber-50 border border-amber-300 rounded-2xl px-4 py-2.5 text-sm font-bold text-amber-900 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="all">ALL</option>
            <option value="paid">PAID</option>
            <option value="unpaid">UNPAID</option>
          </select>
        </div>

        {/* ORDER STATUS (NEW DROPDOWN) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-blue-600" /> ORDER STATUS
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-blue-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">ALL</option>
            <option value="pending">PENDING</option>
            <option value="approved">APPROVED</option>
            <option value="delivered">DELIVERED</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Search className="w-4 h-4" /> Load Payment Summary
        </button>
      </div>
    </div>
  );
};

export default ClientFilterSection;