import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCustomerModal from "./AddCustomer/AddCustomerModal";
import CustomerList from "./CustomersList/CustomersList";
import "./ManageCustomers.css";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [states, setStates] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // এডিট করার জন্য সিলেক্টেড কাস্টমার স্টেট
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [custRes, stateRes, empRes] = await Promise.all([
          fetch("/customers.json"),
          fetch("/customerCountryState.json"),
          fetch("/employees.json"),
        ]);

        if (!custRes.ok || !stateRes.ok || !empRes.ok) {
          throw new Error("Failed to load customer management data.");
        }

        const custData = await custRes.json();
        const stateData = await stateRes.json();
        const empData = await empRes.json();

        setCustomers(custData);
        setStates(stateData);
        setEmployees(empData);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateCustomerId = () => {
    if (customers.length === 0) return "CUST-1001";
    const lastCust = customers[customers.length - 1];
    const lastIdNum = parseInt(lastCust.customerId.replace("CUST-", "")) || 1000;
    return `CUST-${lastIdNum + 1}`;
  };

  // ওপেন মোড (নতুন কাস্টমার যোগ করার জন্য)
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  // এডিট আইকনে ক্লিক করলে মোড ওপেন এবং ডাটা সেট করার হ্যান্ডলার
  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  // কাস্টমার সেভ বা আপডেট করার হ্যান্ডলার
  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      // আপডেট লজিক
      setCustomers((prev) =>
        prev.map((cust) => (cust.customerId === customerData.customerId ? customerData : cust))
      );
      toast.success(`Customer "${customerData.customerName}" updated successfully!`);
    } else {
      // নতুন কাস্টমার যোগ করার লজিক
      setCustomers((prev) => [...prev, customerData]);
      toast.success(`Customer "${customerData.customerName}" created successfully!`);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  // স্ট্যাটাস টোগল এবং সার্ভার আপডেট হ্যান্ডলার
  const handleToggleStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      // TODO: রিয়েল ব্যাকএন্ড API কল এখানে করতে পারেন
      setCustomers((prevCustomers) =>
        prevCustomers.map((cust) =>
          cust.customerId === customerId ? { ...cust, status: newStatus } : cust
        )
      );

      toast.info(`Status updated to ${newStatus.toUpperCase()} successfully!`);
    } catch (err) {
      toast.error("Failed to update status. Please try again.");
    }
  };

  if (loading) return <div className="loading-text">Loading Customers...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="manage-customers-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="add-customer-banner">
        <div className="banner-text">
          <h2>Customer Management</h2>
          <p>Manage your clients, states, and sales representatives easily.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAddModal}>
          + Add Customer
        </button>
      </div>

      <CustomerList 
        customers={customers} 
        onToggleStatus={handleToggleStatus} 
        onEditClick={handleOpenEditModal} 
      />

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