import { useState, useEffect, useMemo } from "react";
import LiabilityListFilter from "./LiabilityListFilter";
import LiabilityListTable from "./LiabilityListTable";
import EditLiabilityModal from "./EditLiabilityModal";
import ViewLiabilityModal from "./ViewLiabilityModal";

// Head and Sub-Head mapping structure
const headToSubHeadMap = {
  "Office Expense": ["Utility", "Rent", "Snacks", "Stationery"],
  "Materials": ["Crown", "Denture", "Orthopedics"],
  "Sales & Marketing": ["Transportation", "Advertising"],
  "Employee": ["Salary", "Entertainment"],
  "Other": ["Bank Charge", "Maintenance", "Legal Expense"],
};

const LiabilityList = () => {
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedHead, setSelectedHead] = useState("ALL");
  const [selectedSubHead, setSelectedSubHead] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [selectedLiabilityToEdit, setSelectedLiabilityToEdit] = useState(null);
  const [selectedLiabilityToView, setSelectedLiabilityToView] = useState(null);

  // Initial Mock Data Load matching updated heads
  useEffect(() => {
    setTimeout(() => {
      const initialData = [
        {
          id: "#1001",
          date: "2026-09-01",
          liabilityHead: "Office Expense",
          liabilitySubHead: "Rent",
          source: "Bank Transfer",
          sourceDetails: "DBBL - A/C 12345",
          amount: 50000,
          note: "September office rent",
          status: "Approved",
          payments: [],
        },
        {
          id: "#1002",
          date: "2026-08-20",
          liabilityHead: "Materials",
          liabilitySubHead: "Crown",
          source: "Cash",
          sourceDetails: "Main Cash Drawer",
          amount: 15000,
          note: "Dental crowns purchase",
          status: "Partial",
          payments: [
            {
              id: "PAY-001",
              date: "2026-08-22",
              amount: 5000,
              paymentMethod: "City Bank",
              note: "1st installment paid",
            },
          ],
        },
        {
          id: "#1003",
          date: "2026-08-25",
          liabilityHead: "Employee",
          liabilitySubHead: "Salary",
          source: "Bank Transfer",
          sourceDetails: "EBL Account",
          amount: 80000,
          note: "August salary",
          status: "Due",
          payments: [],
        },
      ];
      setLiabilities(initialData);
      setLoading(false);
    }, 500);
  }, []);

  // Extract head options from headToSubHeadMap
  const headOptions = useMemo(() => {
    return Object.keys(headToSubHeadMap);
  }, []);

  // Dynamically calculate sub-head options based on selectedHead
  const subHeadOptions = useMemo(() => {
    if (selectedHead === "ALL") {
      // If ALL is selected, return all subheads combined
      return Object.values(headToSubHeadMap).flat();
    }
    return headToSubHeadMap[selectedHead] || [];
  }, [selectedHead]);

  // Save Edit Handler
  const handleSaveEditedData = (updatedLiability) => {
    setLiabilities((prev) =>
      prev.map((item) =>
        item.id === updatedLiability.id ? { ...updatedLiability } : item
      )
    );
    setSelectedLiabilityToEdit(null);
  };

  // Filter Logic Calculation
  const filteredLiabilities = useMemo(() => {
    return liabilities.filter((item) => {
      const matchesHead =
        selectedHead === "ALL" || item.liabilityHead === selectedHead;
      const matchesSubHead =
        selectedSubHead === "ALL" || item.liabilitySubHead === selectedSubHead;
      const matchesDate =
        (!fromDate || item.date >= fromDate) &&
        (!toDate || item.date <= toDate);
      const matchesSearch = Object.values(item).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      return matchesHead && matchesSubHead && matchesDate && matchesSearch;
    });
  }, [liabilities, selectedHead, selectedSubHead, fromDate, toDate, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
             Liabilities List
          </h1>
          <p className="text-sm text-slate-500">
            Manage transactions, view details, and export records
          </p>
        </div>

        {/* Filter Section */}
        <LiabilityListFilter
          selectedHead={selectedHead}
          setSelectedHead={setSelectedHead}
          selectedSubHead={selectedSubHead}
          setSelectedSubHead={setSelectedSubHead}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          headOptions={headOptions}
          subHeadOptions={subHeadOptions}
        />

        {/* Table Data */}
        {loading ? (
          <div className="bg-white p-12 text-center text-slate-500 font-bold rounded-2xl border border-slate-200">
            Loading List...
          </div>
        ) : (
          <LiabilityListTable
            liabilities={filteredLiabilities}
            onEditClick={(liability) => setSelectedLiabilityToEdit(liability)}
            onViewClick={(liability) => setSelectedLiabilityToView(liability)}
          />
        )}

        {/* Edit Modal */}
        {selectedLiabilityToEdit && (
          <EditLiabilityModal
            liability={selectedLiabilityToEdit}
            headToSubHeadMap={headToSubHeadMap}
            onClose={() => setSelectedLiabilityToEdit(null)}
            onSave={handleSaveEditedData}
          />
        )}

        {/* View Modal */}
        {selectedLiabilityToView && (
          <ViewLiabilityModal
            liability={selectedLiabilityToView}
            onClose={() => setSelectedLiabilityToView(null)}
          />
        )}
      </div>
    </div>
  );
};

export default LiabilityList;