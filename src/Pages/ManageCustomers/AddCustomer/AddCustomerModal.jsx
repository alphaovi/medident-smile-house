import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./AddCustomerModal.css";

const AddCustomerModal = ({ nextId, states, employees, customerToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: nextId || "",
    name: "",
    division: states[0]?.stateName || "", 
    address: "",
    phone: "",
    sr: employees[0]?._id || "", 
    openingBalance: "0",
  });

  useEffect(() => {
    if (customerToEdit && states.length > 0) {
      const targetDivision = customerToEdit.division || customerToEdit.state || "";
      
      const matchedState = states.find(
        (st) => st.stateName?.toLowerCase() === targetDivision.toLowerCase()
      );

      setFormData({
        id: customerToEdit.id || "",
        name: customerToEdit.name || "",
        division: matchedState ? matchedState.stateName : targetDivision, 
        address: customerToEdit.address || "",
        phone: customerToEdit.phone || "",
        sr: customerToEdit.sr?._id || customerToEdit.sr || "",
        openingBalance: customerToEdit.openingBalance !== undefined ? customerToEdit.openingBalance : 0,
      });
    }
  }, [customerToEdit, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.division || !formData.sr) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const finalCustomerData = {
      customer: {
        id: formData.id,
        name: formData.name,
        division: formData.division,
        address: formData.address,
        phone: formData.phone,
        sr: formData.sr,
        openingBalance: formData.openingBalance !== "" ? Number(formData.openingBalance) : 0,
        status: customerToEdit ? customerToEdit.status : "Active",
      }
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
            <input type="text" name="id" value={formData.id} disabled />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="form-group">
              <label>State / Division</label>
              <select name="division" value={formData.division} onChange={handleChange} required>
                <option value="">-- Select Division --</option>
                {states.map((st) => (
                  <option key={st._id || st.stateName} value={st.stateName}>
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01711000016"
                required
              />
            </div>

            <div className="form-group">
              <label>SR Name (Sales Rep)</label>
              <select name="sr" value={formData.sr} onChange={handleChange} required>
                <option value="">-- Select SR --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Opening Balance Field */}
          <div className="form-group">
            <label>Opening Balance</label>
            <input
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="Enter opening balance"
            />
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