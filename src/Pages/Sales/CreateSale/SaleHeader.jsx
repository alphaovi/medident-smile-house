import { Building2, User, Calendar as CalendarIcon } from "lucide-react";

const SaleHeader = ({
  states,
  customers,
  selectedState,
  setSelectedState,
  selectedCustomer,
  setSelectedCustomer,
  orderDate,
  setOrderDate,
  filteredCustomers,
  convertToDDMMYYYY,
  dateInputRef,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-base-200/50 p-3 rounded-xl border border-base-300">
      {/* State / Division */}
      <div>
        <label className="label py-0.5 text-xs font-semibold flex items-center gap-1.5 text-base-content/70">
          <Building2 className="size-3.5 text-teal-600" /> State / Division
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCustomer("");
          }}
          className="select select-bordered select-xs w-full font-medium"
          required
        >
          <option value="">Select State...</option>
          {states.map((st) => (
            <option key={st.stateId || st._id} value={st.stateName}>
              {st.stateName}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Name */}
      <div>
        <label className="label py-0.5 text-xs font-semibold flex items-center gap-1.5 text-base-content/70">
          <User className="size-3.5 text-teal-600" /> Customer Name
        </label>
        <select
          value={selectedCustomer}
          disabled={!selectedState}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="select select-bordered select-xs w-full font-medium disabled:opacity-50"
          required
        >
          <option value="">Select Customer...</option>
          {filteredCustomers.map((cust) => (
            <option key={cust.customerId || cust._id} value={cust.customerName}>
              {cust.customerName}
            </option>
          ))}
        </select>
      </div>

      {/* Order Date with full clickable container */}
      <div>
        <label className="label py-0.5 text-xs font-semibold flex items-center gap-1.5 text-base-content/70">
          <CalendarIcon className="size-3.5 text-teal-600" /> Order Date
        </label>
        <div
          onClick={() => {
            if (dateInputRef.current) {
              if (typeof dateInputRef.current.showPicker === "function") {
                dateInputRef.current.showPicker();
              } else {
                dateInputRef.current.focus();
              }
            }
          }}
          className="input input-bordered input-xs w-full font-medium flex items-center justify-between cursor-pointer bg-base-100"
        >
          <span>{convertToDDMMYYYY(orderDate)}</span>
          <input
            ref={dateInputRef}
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="opacity-0 absolute pointer-events-none w-0 h-0"
            required
          />
          <CalendarIcon className="size-3.5 text-base-content/50" />
        </div>
      </div>
    </div>
  );
};

export default SaleHeader;
