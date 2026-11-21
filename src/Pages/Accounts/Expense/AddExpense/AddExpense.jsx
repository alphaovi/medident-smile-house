import { useState } from "react";
import { useNavigate } from "react-router"; 
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  expenseCategories,
  fakeBankList,
} from "../../../../services/expenseData";
import DateInput from "./DateInput";
import GroupSelect from "./GroupSelect";
import TypeSelect from "./TypeSelect";
import PaidFromSelect from "./PaidFromSelect";
import AmountInput from "./AmountInput";
import NoteInput from "./NoteInput";
import {
  cardStyle,
  formStyle,
  headerStyle,
  pageWrapperStyle,
  rowStyle,
  submitButtonStyle,
} from "../../../../services/styles";

const AddExpense = () => {
  const navigate = useNavigate();

  const initialFormState = {
    date: new Date().toISOString().split("T")[0],
    group: "",
    type: "",
    paidFrom: "",
    amount: "",
    note: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleGroupChange = (selectedGroup) => {
    setFormData((prev) => ({
      ...prev,
      group: selectedGroup,
      type: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to add ৳${formData.amount} under ${formData.type}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Save it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "animated fadeInDown",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Submitted Data:", formData);

        toast.success("Expense added successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setFormData(initialFormState);
      }
    });
  };

  const availableTypes = formData.group
    ? expenseCategories[formData.group]
    : [];

  const headerContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  // ইমেজের মতো হুবহু ডিজাইন (Pill Button Style)
  const listButtonStyle = {
    backgroundColor: "#523bf7", // ছবির মতো উজ্জ্বল ভায়োলেট কালার
    color: "#ffffff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "20px", // রাউন্ডেড শেপ
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(82, 59, 247, 0.25)", // হালকা ড্রপ শ্যাডো
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={headerContainerStyle}>
            <div>
              <h2 style={{ margin: 0, fontSize: "22px", color: "#1e293b" }}>
                Add New Expense
              </h2>
              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Fill in the details to record your expense
              </p>
            </div>

            {/* ইমেজের মতো স্টাইল করা বাটন */}
            <button
              type="button"
              style={listButtonStyle}
              onClick={() => navigate("/accounts/expense/expense-list")}
            >
              <span>+</span> Expense List
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <DateInput
            value={formData.date}
            onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
          />

          <div style={rowStyle}>
            <GroupSelect
              options={Object.keys(expenseCategories)}
              selectedGroup={formData.group}
              onSelectGroup={handleGroupChange}
            />

            <TypeSelect
              options={availableTypes}
              selectedType={formData.type}
              onSelectType={(type) =>
                setFormData((prev) => ({ ...prev, type }))
              }
              isDisabled={!formData.group}
            />
          </div>

          <div style={rowStyle}>
            <PaidFromSelect
              banks={fakeBankList}
              selectedBank={formData.paidFrom}
              onSelectBank={(paidFrom) =>
                setFormData((prev) => ({ ...prev, paidFrom }))
              }
            />

            <AmountInput
              value={formData.amount}
              onChange={(amount) =>
                setFormData((prev) => ({ ...prev, amount }))
              }
            />
          </div>

          <NoteInput
            value={formData.note}
            onChange={(note) => setFormData((prev) => ({ ...prev, note }))}
          />

          <button type="submit" style={submitButtonStyle}>
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;