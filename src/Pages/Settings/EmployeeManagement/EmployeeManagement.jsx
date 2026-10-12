import { useState } from "react";
import { useEmployeeManagementService } from "../../../services/useEmployeeManagementService";

const EmployeeManagement = () => {
  const {
    employees,
    customers,
    loading,
    createEmployee,
    updateEmployee,
  } = useEmployeeManagementService();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Active tab inside Assign Modal: 'assigned' or 'unassigned'
  const [assignTab, setAssignTab] = useState("assigned");

  // Selected employee for Edit or Assign Customers
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form inputs for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    joiningDate: "",
    salary: "",
    contact: "",
    status: "Active",
  });

  // Assign customer temporary selection state (holds customer _ids)
  const [assignedCustomerIds, setAssignedCustomerIds] = useState([]);

  // Helper function to calculate next employee ID preview for Add Modal
  const getNextEmployeeIdPreview = () => {
    if (!employees || employees.length === 0) {
      return "EMP-0001";
    }
    // Find the last employee id or max number
    const lastEmp = employees[employees.length - 1];
    if (lastEmp && lastEmp.id) {
      const numericPart = parseInt(lastEmp.id.replace("EMP-", ""), 10);
      if (!isNaN(numericPart)) {
        return `EMP-${String(numericPart + 1).padStart(4, "0")}`;
      }
    }
    return "EMP-0001";
  };

  // Handle Input Changes for Add/Edit Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Edit Modal with data
  const handleOpenEditModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      designation: employee.designation,
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
      salary: employee.salary,
      contact: employee.contact,
      status: employee.status,
    });
    setIsEditModalOpen(true);
  };

  // Open Assign Customers Modal
  const handleOpenAssignModal = (employee) => {
    setSelectedEmployee(employee);
    const currentAssigned =
      employee.assignCustomers?.map(
        (item) => item.customer?._id || item.customer,
      ) || [];
    setAssignedCustomerIds(currentAssigned);
    setAssignTab("assigned"); // Default to assigned tab
    setIsAssignModalOpen(true);
  };

  // Handle Create Employee Submit
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      designation: formData.designation,
      joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString() : new Date().toISOString(),
      salary: Number(formData.salary),
      contact: formData.contact,
      status: formData.status,
      assignCustomers: [],
    };

    const res = await createEmployee(payload);
    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        designation: "",
        joiningDate: "",
        salary: "",
        contact: "",
        status: "Active",
      });
    } else {
      alert(res.message);
    }
  };

  // Handle Update Employee Submit
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      designation: formData.designation,
      joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString() : new Date().toISOString(),
      salary: Number(formData.salary),
      contact: formData.contact,
      status: formData.status,
    };

    const res = await updateEmployee(selectedEmployee.id, payload);
    if (res.success) {
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
    } else {
      alert(res.message);
    }
  };

  // Toggle Customer Selection inside Assign Modal
  const toggleCustomerSelection = (customerId) => {
    if (assignedCustomerIds.includes(customerId)) {
      setAssignedCustomerIds(
        assignedCustomerIds.filter((id) => id !== customerId),
      );
    } else {
      setAssignedCustomerIds([...assignedCustomerIds, customerId]);
    }
  };

  // Save Assigned Customers
  const handleSaveAssignments = async () => {
    const formattedAssignCustomers = assignedCustomerIds.map((custId) => {
      const cust = customers.find((c) => c._id === custId);
      return {
        customer: custId,
        customerId: cust ? cust.id : "",
      };
    });

    const payload = {
      assignCustomers: formattedAssignCustomers,
    };

    const res = await updateEmployee(selectedEmployee.id, payload);

    if (res.success) {
      setIsAssignModalOpen(false);
    } else {
      alert(res.message);
    }
  };

  // Filtered lists for the two boxes / tabs inside Assign Modal
  const assignedCustomersList = customers.filter((cust) =>
    assignedCustomerIds.includes(cust._id)
  );

  const unassignedCustomersList = customers.filter((cust) => {
    const isAssignedToAnyone = cust.sr && cust.sr !== null;
    const isCurrentlySelected = assignedCustomerIds.includes(cust._id);
    return !isAssignedToAnyone && !isCurrentlySelected;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage employee details, statuses, and customer assignments.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              designation: "",
              joiningDate: "",
              salary: "",
              contact: "",
              status: "Active",
            });
            setIsAddModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition font-medium text-sm flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Employee Name & ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Salary & Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Assigned Customers
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">
                      {emp.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      ID: {emp.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {emp.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="font-medium text-gray-900">
                      ৳{emp.salary}
                    </div>
                    <div className="text-xs text-gray-500">{emp.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${emp.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">
                      {emp.assignCustomers?.length || 0} Assigned
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenAssignModal(emp)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition text-xs font-semibold"
                    >
                      Assign Customers
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(emp)}
                      className="text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition text-xs font-semibold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  {loading ? "Loading employees from database..." : "No employees found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal (Shows upcoming unique ID preview, readOnly/disabled) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Add New Employee
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Employee ID (Auto Generated)
                </label>
                <input
                  type="text"
                  value={getNextEmployeeIdPreview()}
                  disabled
                  readOnly
                  className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded-xl px-3.5 py-2 text-sm cursor-not-allowed select-none font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Imran Hossain"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Sales Manager"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Salary (৳)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="45000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="01834567890"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Edit Employee Info
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={selectedEmployee?.id || ""}
                  disabled
                  readOnly
                  className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-xl px-3.5 py-2 text-sm cursor-not-allowed select-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Salary (৳)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Customers Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Assign Customers
                </h2>
                <p className="text-xs text-gray-500">
                  Employee:{" "}
                  <span className="font-semibold text-gray-700">
                    {selectedEmployee?.name}
                  </span>{" "}
                  <span className="font-mono text-gray-400">({selectedEmployee?.id})</span>
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                &times;
              </button>
            </div>

            {/* 2 Tabs / Boxes Navigation */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAssignTab("assigned")}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  assignTab === "assigned"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Assigned Customers ({assignedCustomersList.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignTab("unassigned")}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  assignTab === "unassigned"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Unselected / Available ({unassignedCustomersList.length})
              </button>
            </div>

            {/* Customers List Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {assignTab === "assigned" ? (
                assignedCustomersList.length > 0 ? (
                  assignedCustomersList.map((cust) => (
                    <div
                      key={cust._id}
                      className="p-3.5 flex items-center justify-between bg-emerald-50/40 border border-emerald-100 rounded-xl hover:bg-emerald-50/70 transition"
                    >
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {cust.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          ID: {cust.id}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCustomerSelection(cust._id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        Unselect
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No customers assigned to this employee yet.
                  </div>
                )
              ) : (
                unassignedCustomersList.length > 0 ? (
                  unassignedCustomersList.map((cust) => (
                    <div
                      key={cust._id}
                      className="p-3.5 flex items-center justify-between bg-gray-50/70 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {cust.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          ID: {cust.id}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCustomerSelection(cust._id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition"
                      >
                        Select
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No unassigned customers available.
                  </div>
                )
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;