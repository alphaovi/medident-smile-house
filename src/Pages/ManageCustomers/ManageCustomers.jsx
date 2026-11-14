import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCustomerModal from "./AddCustomer/AddCustomerModal";
import CustomerList from "./CustomersList/CustomersList";

import "./ManageCustomers.css";

// 🟢 সঠিক সার্ভিস পাথ ও ইমপোর্ট এখানে যুক্ত করা হলো
import { customerService } from "../../services/useCustomerService/useCustomerService";
import { employeeSettingService } from "../../services/useEmployeeServices";
import { stateService } from "../../services/useStateService/useStateService";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [states, setStates] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Backend theke ekjoge customer, state ebong employee data fetch kora hocche
        const [custData, stateData, empData] = await Promise.all([
          customerService.getAllCustomers(),
          stateService.getAllStates(),
          employeeSettingService.getAllEmployees(),
        ]);

        setCustomers(custData || []);
        setStates(stateData || []);
        setEmployees(empData || []);
      } catch (err) {
        setError(err.message || "Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateCustomerId = () => {
    if (customers.length === 0) return "CUST-1001";
    const lastCust = customers[customers.length - 1];
    const lastIdNum = parseInt((lastCust.id || lastCust.customerId).replace("CUST-", "")) || 1000;
    return `CUST-${lastIdNum + 1}`;
  };

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (customerDataPayload) => {
    try {
      if (editingCustomer) {
        const customerId = editingCustomer.id || editingCustomer.customerId;
        const updatedCustomer = await customerService.updateCustomer(customerId, customerDataPayload.customer);
        
        setCustomers((prev) =>
          prev.map((cust) => ((cust.id === customerId || cust.customerId === customerId) ? updatedCustomer : cust))
        );
        toast.success("Customer updated successfully!");
      } else {
        const newCustomer = await customerService.createCustomer(customerDataPayload);
        setCustomers((prev) => [...prev, newCustomer]);
        toast.success("Customer created successfully!");
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (err) {
      toast.error(err.message || "Failed to save customer.");
    }
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await customerService.updateCustomer(customerId, { status: newStatus });

      setCustomers((prevCustomers) =>
        prevCustomers.map((cust) =>
          (cust.id === customerId || cust.customerId === customerId) ? { ...cust, status: newStatus } : cust
        )
      );

      toast.info(`Status updated to ${newStatus.toUpperCase()} successfully!`);
    } catch (err) {
      toast.error("Failed to update status. Please try again.");
    }
  };

  if (loading) return <div className="loading-text p-10 text-center font-semibold">Loading Customers & Settings...</div>;
  if (error) return <div className="error-text p-10 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="w-full min-h-screen px-4 md:px-6 lg:px-8 py-6 bg-slate-50 box-border manage-customers-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 add-customer-banner">
        <div className="banner-text">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Customer Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your clients, states, and sales representatives easily.</p>
        </div>
        <button className="add-btn bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer" onClick={handleOpenAddModal}>
          + Add Customer
        </button>
      </div>

      <div className="w-full">
        <CustomerList 
          customers={customers} 
          employees={employees}   
          onToggleStatus={handleToggleStatus} 
          onEditClick={handleOpenEditModal} 
        />
      </div>

      {isModalOpen && (
        <AddCustomerModal
          nextId={generateCustomerId()}
          states={states}        
          employees={employees}  
          customerToEdit={editingCustomer}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default ManageCustomers;