
import Select from "react-select";
import { MapPin, User, Calendar } from "lucide-react";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "38px",
    fontSize: "14px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#0d9488" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #0d9488" : "none",
    "&:hover": { borderColor: "#0d9488" },
  }),
  menu: (provided) => ({ ...provided, fontSize: "14px", zIndex: 9999 }),
};

const SaleHeader = ({
  states = [],
  customerOptions = [],
  selectedState,
  setSelectedState,
  selectedCustomer,
  setSelectedCustomer,
  orderDate,
  setOrderDate,
  convertToDDMMYYYY,
}) => {
  // State options-er shuru te "All" option add kora holo
  const stateOptions = [
    { value: "All", label: "All States" },
    ...(Array.isArray(states)
      ? states.map((s) => ({
          value: s?.stateName || s?.state || s?.name,
          label: s?.stateName || s?.state || s?.name,
        }))
      : []),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-300">
      <div>
        <label className="label py-1 text-xs font-bold flex items-center gap-1.5 text-base-content/80">
          <MapPin className="size-3.5 text-teal-600" /> State / Region
        </label>
        <Select
          value={selectedState}
          onChange={(val) => {
            setSelectedState(val);
            setSelectedCustomer(null); // State change hole customer reset hobe
          }}
          options={stateOptions}
          placeholder="Search State..."
          styles={customSelectStyles}
          isSearchable
          isClearable
        />
      </div>

      <div>
        <label className="label py-1 text-xs font-bold flex items-center gap-1.5 text-base-content/80">
          <User className="size-3.5 text-teal-600" /> Customer Name
        </label>
        <Select
          value={selectedCustomer}
          onChange={setSelectedCustomer}
          options={customerOptions}
          placeholder="Search Customer..."
          styles={customSelectStyles}
          isSearchable
          isClearable
        />
      </div>

      <div>
        <label className="label py-1 text-xs font-bold flex items-center gap-1.5 text-base-content/80">
          <Calendar className="size-3.5 text-teal-600" /> Order Date{" "}
          <span className="text-[11px] text-teal-600 font-bold ml-1">
            ({convertToDDMMYYYY(orderDate)})
          </span>
        </label>
        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          className="input input-bordered input-sm h-[38px] w-full font-medium text-sm"
          required
        />
      </div>
    </div>
  );
};

export default SaleHeader;