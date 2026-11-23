import { useState, useEffect, useRef } from "react";

const PaymentSearchHeader = ({
  selectedState,
  onSelectState,
  statesList = [],
  clientName,
  setClientName,
  address,
  customersList = [],
  onSelectCustomer,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCustomers = customersList.filter((cust) => {
    const matchesDivision =
      !selectedState || (cust.division || "").toLowerCase() === selectedState.toLowerCase();

    const search = clientName.trim().toLowerCase();
    const matchesSearch =
      !search ||
      (cust.name || "").toLowerCase().includes(search) ||
      (cust.id || "").toLowerCase().includes(search);

    return matchesDivision && matchesSearch;
  });

  return (
    <div className="bg-sky-100 p-4 rounded-md mb-6">
      <h1 className="text-2xl font-bold text-center text-sky-600 mb-1">CREATE PAYMENT</h1>
      <p className="text-xs text-center text-sky-500 mb-4">
        (Filter by Division and search by Customer name or ID. After selecting from the list, orders &amp; address will load automatically.)
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* Division Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedState}
            onChange={(e) => {
              onSelectState(e.target.value);
              setShowDropdown(true);
            }}
            className="w-full p-2 bg-amber-400 font-semibold text-amber-950 rounded border border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Divisions</option>
            {statesList.map((div, idx) => (
              <option key={idx} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Search */}
        <div className="relative flex-1 min-w-[220px]" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Customer Name or ID Search"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full p-2 bg-amber-400 font-semibold placeholder-amber-900 text-amber-950 rounded border border-amber-500 focus:outline-none"
          />
          {showDropdown && filteredCustomers.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-56 overflow-y-auto z-50 text-sm">
              {filteredCustomers.map((cust) => (
                <li
                  key={cust._id}
                  onClick={() => {
                    onSelectCustomer(cust);
                    setShowDropdown(false);
                  }}
                  className="p-2 hover:bg-sky-50 cursor-pointer border-b border-gray-100 flex justify-between items-center gap-2"
                >
                  <div>
                    <span className="font-semibold text-gray-800 block">{cust.name}</span>
                    {cust.id && <span className="text-xs text-gray-500">{cust.id}</span>}
                  </div>
                  {cust.division && (
                    <span className="text-[11px] px-2 py-0.5 bg-sky-100 text-sky-700 rounded font-medium">
                      {cust.division}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Auto-filled Address */}
        <input
          type="text"
          placeholder="Address Auto Fill up"
          value={address}
          readOnly
          className="flex-1 min-w-[200px] p-2 bg-amber-400 font-semibold placeholder-amber-900 text-amber-950 rounded border border-amber-500 outline-none cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default PaymentSearchHeader;