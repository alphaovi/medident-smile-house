import { useState, useEffect, useMemo } from "react";
import ExpenseListFilter from "./ExpenseListFilter";
import ExpenseListTable from "./ExpenseListTable";
import EditExpenseModal from "./EditExpenseModal";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedHead, setSelectedHead] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedExpenseToEdit, setSelectedExpenseToEdit] = useState(null);

  // Fake Initial Data
  useEffect(() => {
    setTimeout(() => {
      const initialData = [
        {
          id: "EXP-101",
          date: "2026-08-28",
          expenseHead: "Office Expense",
          expenseSubHead: "Stationery",
          paidFrom: "Petty Cash",
          amount: 1500,
          note: "Office paper, pens, and printer ink purchased for accounting section.",
          status: "Pending",
        },
        {
          id: "EXP-102",
          date: "2026-08-29",
          expenseHead: "Sales & Marketing",
          expenseSubHead: "Advertising",
          paidFrom: "City Bank",
          amount: 12000,
          note: "Facebook and Google Ads campaign for new product launch.",
          status: "Approved",
        },
        {
          id: "EXP-103",
          date: "2026-08-30",
          expenseHead: "Employee",
          expenseSubHead: "Entertainment",
          paidFrom: "Bkash",
          amount: 3200,
          note: "Team lunch treat after monthly review meeting.",
          status: "Pending",
        },
      ];
      setExpenses(initialData);
      setLoading(false);
    }, 500);
  }, []);

  // Expense Head Options
  const headOptions = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.expenseHead).filter(Boolean)));
  }, [expenses]);

  // Status Change Handler
  const handleStatusChange = (expenseId, newStatus) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === expenseId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Edit Save Handler
  const handleSaveEditedData = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === updatedExpense.id ? { ...updatedExpense } : item
      )
    );
    setSelectedExpenseToEdit(null);
  };

  // Filter Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesHead =
        selectedHead === "ALL" || item.expenseHead === selectedHead;
      const matchesDate =
        (!fromDate || item.date >= fromDate) && (!toDate || item.date <= toDate);
      const matchesSearch = Object.values(item).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      return matchesHead && matchesDate && matchesSearch;
    });
  }, [expenses, selectedHead, fromDate, toDate, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <ExpenseListFilter
          selectedHead={selectedHead}
          setSelectedHead={setSelectedHead}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          headOptions={headOptions}
        />

        {loading ? (
          <div className="bg-white p-12 text-center text-slate-500 font-bold rounded-2xl border">
            Loading Expenses...
          </div>
        ) : (
          <ExpenseListTable
            expenses={filteredExpenses}
            onStatusChange={handleStatusChange}
            onEditClick={(expense) => setSelectedExpenseToEdit(expense)}
          />
        )}

        {selectedExpenseToEdit && (
          <EditExpenseModal
            expense={selectedExpenseToEdit}
            onClose={() => setSelectedExpenseToEdit(null)}
            onSave={handleSaveEditedData}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseList;