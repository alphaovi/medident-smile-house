import { useState, useEffect, useMemo } from 'react';
import FinancialExpenseFilter from './FinancialExpenseFilter';
import FinancialExpenseTable from './FinancialExpenseTable';

const FinancialExpenseReports = () => {
  const [allExpenses, setAllExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubGroup, setSelectedSubGroup] = useState('');

  // 1. Fetch Categories
  useEffect(() => {
    fetch('/expenseCategroies.json')
      .then((res) => {
        if (!res.ok) throw new Error('Categories fetch failed');
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // 2. Fetch Expenses Data
  useEffect(() => {
    fetch('/financialExpenseReport.json')
      .then((res) => {
        if (!res.ok) throw new Error('Expense report fetch failed');
        return res.json();
      })
      .then((data) => {
        setAllExpenses(data);
        setFilteredExpenses(data);
      })
      .catch((err) => console.error('Error fetching expense data:', err));
  }, []);

  // 3. Extract Groups
  const groups = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((cat) => cat.group);
    }
    return [...new Set(allExpenses.map((item) => item.group))].filter(Boolean);
  }, [categories, allExpenses]);

  // 4. Extract SubGroups
  const subGroups = useMemo(() => {
    if (!selectedGroup) return [];
    
    const categoryMatch = categories.find((cat) => cat.group === selectedGroup);
    if (categoryMatch && categoryMatch.subGroups) {
      return categoryMatch.subGroups;
    }

    return [
      ...new Set(
        allExpenses
          .filter((item) => item.group === selectedGroup)
          .map((item) => item.subGroup)
      )
    ].filter(Boolean);
  }, [categories, allExpenses, selectedGroup]);

  // 5. Handle Group Selection Change
  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setSelectedSubGroup('');
  };

  // 6. Automatic Filtering Logic
  useEffect(() => {
    let result = [...allExpenses];

    // Filter by Date Range
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filter by Group
    if (selectedGroup) {
      result = result.filter((item) => item.group === selectedGroup);
    }

    // Filter by Sub Group
    if (selectedSubGroup) {
      result = result.filter((item) => item.subGroup === selectedSubGroup);
    }

    setFilteredExpenses(result);
  }, [fromDate, toDate, selectedGroup, selectedSubGroup, allExpenses]);

  const totalAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50/50 min-h-screen">
      
      {/* Header Title Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Expense Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Filter expense records dynamically by Date Range, Group, and Sub Group
        </p>
      </div>

      {/* Filter Component */}
      <FinancialExpenseFilter
        fromDate={fromDate}
        toDate={toDate}
        selectedGroup={selectedGroup}
        selectedSubGroup={selectedSubGroup}
        groups={groups}
        subGroups={subGroups}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onGroupChange={handleGroupChange}
        onSubGroupChange={setSelectedSubGroup}
      />

      {/* Table Component */}
      <FinancialExpenseTable
        reports={filteredExpenses}
        totalAmount={totalAmount}
        selectedGroup={selectedGroup}
      />
    </div>
  );
};

export default FinancialExpenseReports;