import { useState, useMemo, useEffect, useRef } from "react";

const PaymentSearchFilter = ({ ordersData = [], customersData = [], onFilter }) => {
  const [selectedState, setSelectedState] = useState("");
  const [clientName, setClientName] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Merge customers from customerService and fallback from ordersData
  const mergedCustomers = useMemo(() => {
    const map = new Map();

    if (Array.isArray(customersData)) {
      customersData.forEach((cust) => {
        const id = String(cust._id || cust.id || "");
        const name =
          cust.doctorName ||
          cust.customerName ||
          cust.name ||
          cust.companyName ||
          "";
        const stateVal = cust.division || cust.state || cust.stateOrRegion || "";
        const addr =
          cust.address ||
          cust.fullAddress ||
          cust.clinicAddress ||
          "";

        if (id || name) {
          map.set(id || name, {
            _id: id,
            name,
            state: stateVal,
            address: addr,
          });
        }
      });
    }

    if (Array.isArray(ordersData)) {
      ordersData.forEach((order) => {
        const custObj = typeof order?.customer === "object" ? order.customer : null;
        const id = String(custObj?._id || custObj?.id || order?.customer || "");
        const name =
          custObj?.doctorName ||
          custObj?.customerName ||
          custObj?.name ||
          custObj?.companyName ||
          "";
        const stateVal =
          order?.stateOrRegion ||
          custObj?.division ||
          custObj?.state ||
          "";
        const addr =
          custObj?.address ||
          custObj?.fullAddress ||
          custObj?.clinicAddress ||
          "";

        if ((id || name) && !map.has(id || name)) {
          map.set(id || name, {
            _id: id,
            name,
            state: stateVal,
            address: addr,
          });
        } else if ((id || name) && map.has(id || name)) {
          const existing = map.get(id || name);
          map.set(id || name, {
            ...existing,
            state: existing.state || stateVal,
            address: existing.address || addr,
          });
        }
      });
    }

    return Array.from(map.values());
  }, [customersData, ordersData]);

  // Unique States / Divisions list
  const statesList = useMemo(() => {
    const set = new Set();
    mergedCustomers.forEach((c) => {
      if (c.state) set.add(c.state);
    });
    return Array.from(set);
  }, [mergedCustomers]);

  // Filter customers by selectedState and typed clientName
  const filteredCustomers = useMemo(() => {
    return mergedCustomers.filter((c) => {
      const matchesState =
        !selectedState ||
        String(c.state || "").toLowerCase() === selectedState.toLowerCase();

      const matchesName =
        !clientName.trim() ||
        String(c.name || "").toLowerCase().includes(clientName.toLowerCase());

      return matchesState && matchesName;
    });
  }, [mergedCustomers, selectedState, clientName]);

  // Automatically sync filter changes without needing Search button click
  useEffect(() => {
    if (typeof onFilter !== "function") return;

    const hasAnyFilter =
      Boolean(selectedState) ||
      Boolean(selectedCustomerId) ||
      Boolean(clientName.trim()) ||
      Boolean(officeAddress.trim()) ||
      Boolean(fromDate) ||
      Boolean(toDate);

    if (!hasAnyFilter) {
      onFilter(null);
      return;
    }

    onFilter({
      state: selectedState,
      customerId: selectedCustomerId,
      clientName,
      officeAddress,
      fromDate,
      toDate,
    });
  }, [
    selectedState,
    selectedCustomerId,
    clientName,
    officeAddress,
    fromDate,
    toDate,
    onFilter,
  ]);

  const handleStateChange = (stateVal) => {
    setSelectedState(stateVal);
    setSelectedCustomerId("");
    setClientName("");
    setOfficeAddress("");
  };

  const handleSelectCustomer = (cust) => {
    setSelectedCustomerId(cust._id || "");
    setClientName(cust.name || "");
    setOfficeAddress(cust.address || cust.state || "Dhaka, Bangladesh");
    if (cust.state && !selectedState) {
      setSelectedState(cust.state);
    }
    setShowCustomerDropdown(false);
  };

  const handleClearClientSearch = () => {
    setClientName("");
    setSelectedCustomerId("");
    setOfficeAddress("");
    setShowCustomerDropdown(false);
  };

  const handleReset = () => {
    setSelectedState("");
    setSelectedCustomerId("");
    setClientName("");
    setOfficeAddress("");
    setFromDate("");
    setToDate("");
    if (typeof onFilter === "function") {
      onFilter(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xs text-slate-700 tracking-wider uppercase">
          Payment Search &amp; Filter
        </h3>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
          Live Auto-Filter Active
        </span>
      </div>

      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. State / Division Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              State / Division
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-slate-700 bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition cursor-pointer"
            >
              <option value="">All States</option>
              {statesList.map((st, idx) => (
                <option key={idx} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Client / Customer / Company Search Dropdown with Clear Cross Button */}
          <div className="relative" ref={dropdownRef}>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Client / Customer / Company Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search or select Client / Customer..."
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setSelectedCustomerId("");
                  setShowCustomerDropdown(true);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 pr-9 text-slate-700 bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition"
              />
              {clientName && (
                <button
                  type="button"
                  onClick={handleClearClientSearch}
                  title="Clear search"
                  className="absolute right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {showCustomerDropdown && filteredCustomers.length > 0 && (
              <ul className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-30 py-1">
                {filteredCustomers.map((cust, idx) => (
                  <li
                    key={cust._id || idx}
                    onClick={() => handleSelectCustomer(cust)}
                    className="px-3 py-2 hover:bg-sky-50 cursor-pointer border-b last:border-b-0 border-slate-100 flex justify-between items-center gap-2 transition"
                  >
                    <span className="font-semibold text-slate-800">
                      {cust.name}
                    </span>
                    {cust.state && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-sky-100 text-sky-700 rounded-md">
                        {cust.state}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 3. Auto-filled Address */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Address (Auto-filled)
            </label>
            <input
              type="text"
              placeholder="Address auto-fills on selection"
              value={officeAddress}
              readOnly
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 bg-slate-100/80 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Select From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={fromDate}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-slate-700 bg-white cursor-pointer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1.5">
              Select To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={toDate}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-slate-700 bg-white cursor-pointer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSearchFilter;