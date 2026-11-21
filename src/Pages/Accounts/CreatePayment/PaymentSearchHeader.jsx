import { useState, useEffect, useRef } from "react";

const PaymentSearchHeader = ({
  selectedState,
  onSelectState,
  statesList = [],
  clientName,
  setClientName,
  address,
  doctorsList = [],
  onSelectDoctor,
}) => {
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const doctorDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target)) {
        setShowDoctorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter Doctors by selected state & typed name
  const filteredDoctors = doctorsList.filter((doc) => {
    const docState = doc.division || doc.state || doc.stateOrRegion || "";
    const matchesState =
      !selectedState || docState.toLowerCase() === selectedState.toLowerCase();

    const docName = doc.doctorName || doc.name || doc.customerName || "";
    const docId = doc.customerId || doc.id || doc._id || "";
    const clinicName = doc.clinicName || doc.chamberName || "";

    const search = clientName.toLowerCase();
    const matchesName =
      docName.toLowerCase().includes(search) ||
      String(docId).toLowerCase().includes(search) ||
      clinicName.toLowerCase().includes(search);

    return matchesState && matchesName;
  });

  return (
    <div className="bg-sky-100 p-4 rounded-md mb-6">
      <h1 className="text-2xl font-bold text-center text-sky-600 mb-1">CREATE PAYMENT</h1>
      <p className="text-xs text-center text-sky-500 mb-4">
        (Filter by State and search by Doctor/Client name. After selecting from the list, orders & address will load automatically.)
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* State / Division Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedState}
            onChange={(e) => {
              onSelectState(e.target.value);
              setShowDoctorDropdown(true);
            }}
            className="w-full p-2 bg-amber-400 font-semibold text-amber-950 rounded border border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="">All States / Divisions</option>
            {statesList.map((st, idx) => (
              <option key={idx} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Client / Doctor Search */}
        <div className="relative flex-1 min-w-[220px]" ref={doctorDropdownRef}>
          <input
            type="text"
            placeholder="Doctor / Client Name Search"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              setShowDoctorDropdown(true);
            }}
            onFocus={() => setShowDoctorDropdown(true)}
            className="w-full p-2 bg-amber-400 font-semibold placeholder-amber-900 text-amber-950 rounded border border-amber-500 focus:outline-none"
          />
          {showDoctorDropdown && filteredDoctors.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-56 overflow-y-auto z-50 text-sm">
              {filteredDoctors.map((doc) => {
                const docName = doc.doctorName || doc.name || doc.customerName || "Unnamed";
                const clinicName = doc.clinicName || doc.chamberName || "";
                const docState = doc.division || doc.state || "";
                return (
                  <li
                    key={doc._id}
                    onClick={() => {
                      onSelectDoctor(doc);
                      setShowDoctorDropdown(false);
                    }}
                    className="p-2 hover:bg-sky-50 cursor-pointer border-b border-gray-100 flex justify-between items-center gap-2"
                  >
                    <div>
                      <span className="font-semibold text-gray-800 block">{docName}</span>
                      {clinicName && (
                        <span className="text-xs text-gray-500">{clinicName}</span>
                      )}
                    </div>
                    {docState && (
                      <span className="text-[11px] px-2 py-0.5 bg-sky-100 text-sky-700 rounded font-medium">
                        {docState}
                      </span>
                    )}
                  </li>
                );
              })}
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