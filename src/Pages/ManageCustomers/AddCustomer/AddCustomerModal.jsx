import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./AddCustomerModal.css";

const AddCustomerModal = ({ nextId, states, employees, customerToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: nextId,
    customerName: "",
    state: states[0]?.stateName || "", 
    address: "",
    phoneNo: "",
    srName: employees[0]?.employeeName || "",
  });

  // যদি এডিট মোড হয়, তবে ইনপুট ফিল্ডগুলোতে আগের ডাটা লোড করে দেওয়া
  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        customerId: customerToEdit.customerId,
        customerName: customerToEdit.customerName,
        state: customerToEdit.state,
        address: customerToEdit.address,
        phoneNo: customerToEdit.phoneNo,
        srName: customerToEdit.srName,
      });
    }
  }, [customerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNo || !formData.address || !formData.state) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const finalCustomerData = {
      ...customerToEdit, // এডিট করার সময় পুরোনো ডাটা ও আইডি ঠিক রাখার জন্য
      customerId: formData.customerId,
      customerName: formData.customerName,
      state: formData.state,
      address: formData.address,
      phoneNo: formData.phoneNo,
      srName: formData.srName,
      status: customerToEdit ? customerToEdit.status : "active", // নতুন হলে active, এডিট হলে পুরোনো status থাকবে
    };

    onSave(finalCustomerData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{customerToEdit ? "Edit Customer" : "Add New Customer"}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer ID</label>
            <input type="text" name="customerId" value={formData.customerId} disabled />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="form-group">
              <label>State / Division</label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">-- Select State --</option>
                {states.map((st) => (
                  <option key={st.stateId} value={st.stateName}>
                    {st.stateName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Office Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full office address"
              rows="2"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone No</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="+8801XXXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label>SR Name (Sales Rep)</label>
              <select name="srName" value={formData.srName} onChange={handleChange}>
                {employees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeName}>
                    {emp.employeeName} ({emp.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {customerToEdit ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;