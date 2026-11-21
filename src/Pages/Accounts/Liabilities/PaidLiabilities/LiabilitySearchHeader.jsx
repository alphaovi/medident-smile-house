import { useState, useEffect, useRef } from "react";

const headToSubHeadMap = {
  "Office Expense": ["Utility", "Rent", "Snacks", "Stationery"],
  Materials: ["Crown", "Denture", "Orthopedics"],
  "Sales & Marketing": ["Transportation", "Advertising"],
  Employee: ["Salary", "Entertainment"],
  Other: ["Bank Charge", "Maintenance", "Legal Expense"],
};

const LiabilitySearchHeader = ({
  headName,
  setHeadName,
  subHeadName,
  setSubHeadName,
  sourceName,
  setSourceName,
  onSelectHead,
  onSelectSubHead,
  onSelectSource,
  onReset,
}) => {
  const [showHeadDropdown, setShowHeadDropdown] = useState(false);
  const [showSubHeadDropdown, setShowSubHeadDropdown] = useState(false);

  const headDropdownRef = useRef(null);
  const subHeadDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headDropdownRef.current &&
        !headDropdownRef.current.contains(event.target)
      ) {
        setShowHeadDropdown(false);
      }
      if (
        subHeadDropdownRef.current &&
        !subHeadDropdownRef.current.contains(event.target)
      ) {
        setShowSubHeadDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const headsList = Object.keys(headToSubHeadMap);
  const filteredHeads = headsList.filter((h) =>
    h.toLowerCase().includes(headName.toLowerCase())
  );

  const availableSubHeads =
    headName && headToSubHeadMap[headName] ? headToSubHeadMap[headName] : [];
  const filteredSubHeads = availableSubHeads.filter((sh) =>
    sh.toLowerCase().includes(subHeadName.toLowerCase())
  );

  return (
    <div className="bg-sky-100 p-4 rounded-md mb-6">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold text-sky-600 flex-1 text-center">
          PAID LIABILITIES
        </h1>
        {(headName || subHeadName || sourceName) && (
          <button
            onClick={onReset}
            className="text-xs bg-sky-200 text-sky-800 px-2 py-1 rounded font-semibold hover:bg-sky-300 transition-colors"
          >
            Clear Filters ✕
          </button>
        )}
      </div>
      <p className="text-xs text-center text-sky-500 mb-4">
        (Select Group/Head, Sub Group/Sub Head, and Source to filter)
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* Head / Group Search */}
        <div className="relative flex-1 min-w-[200px]" ref={headDropdownRef}>
          <input
            type="text"
            placeholder="All Groups (Head)"
            value={headName}
            onChange={(e) => {
              setHeadName(e.target.value);
              setShowHeadDropdown(true);
            }}
            onFocus={() => setShowHeadDropdown(true)}
            className="w-full p-2 bg-amber-400 font-semibold placeholder-amber-900 rounded border border-amber-500 focus:outline-none"
          />
          {showHeadDropdown && filteredHeads.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-50 text-sm">
              {filteredHeads.map((head, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    onSelectHead(head);
                    setShowHeadDropdown(false);
                  }}
                  className="p-2 hover:bg-sky-50 cursor-pointer border-b border-gray-100 font-semibold text-gray-800"
                >
                  {head}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sub Head / Sub Group Search */}
        <div className="relative flex-1 min-w-[200px]" ref={subHeadDropdownRef}>
          <input
            type="text"
            placeholder="All Sub Groups (Sub Head)"
            value={subHeadName}
            onChange={(e) => {
              setSubHeadName(e.target.value);
              setShowSubHeadDropdown(true);
            }}
            onFocus={() => setShowSubHeadDropdown(true)}
            disabled={!headName}
            className="w-full p-2 bg-amber-400 font-semibold placeholder-amber-900 rounded border border-amber-500 focus:outline-none disabled:bg-gray-200 disabled:placeholder-gray-500 disabled:cursor-not-allowed"
          />
          {showSubHeadDropdown && filteredSubHeads.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-50 text-sm">
              {filteredSubHeads.map((subHead, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    onSelectSubHead(subHead);
                    setShowSubHeadDropdown(false);
                  }}
                  className="p-2 hover:bg-sky-50 cursor-pointer border-b border-gray-100 text-gray-800"
                >
                  {subHead}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Source Dropdown */}
        <select
          value={sourceName}
          onChange={(e) => {
            setSourceName(e.target.value);
            onSelectSource(e.target.value);
          }}
          className="flex-1 min-w-[200px] p-2 bg-amber-400 font-semibold text-amber-950 rounded border border-amber-500 outline-none cursor-pointer"
        >
          <option value="">All Sources</option>
          <option value="Service">Service</option>
          <option value="Supplier">Supplier</option>
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
        </select>
      </div>
    </div>
  );
};

export default LiabilitySearchHeader;