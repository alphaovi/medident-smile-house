import { useState, useRef, useEffect } from "react";

// Reusable Searchable Dropdown supporting search typing and scrolling
const SearchableSelect = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on user search term
  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-600 mb-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded p-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="text-xs text-gray-400">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 p-2 max-h-48 overflow-y-auto">
          {/* Search Input inside Dropdown */}
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded p-1 mb-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />

          {/* Option List with Scrollbar */}
          <ul className="space-y-1">
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-gray-500 text-xs"
            >
              -- Clear Selection --
            </li>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`p-1.5 hover:bg-blue-50 rounded cursor-pointer text-xs ${
                    value === option ? "bg-blue-100 font-semibold" : ""
                  }`}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-400 text-xs text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;