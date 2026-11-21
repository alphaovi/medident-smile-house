// AddLiability.jsx

import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiabilityForm from "./LiabilityForm";

const AddLiability = () => {
  const handleFormSubmit = (formData, resetForm) => {
    // 1. SweetAlert Confirmation Modal
    Swal.fire({
      title: "Confirm Liability Entry?",
      text: `Are you sure you want to add ৳${formData.amount} under ${formData.liabilityHead} (${formData.liabilitySubHead})?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Confirm!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Mock save action
        console.log("Liability Saved Successfully:", formData);

        // Reset the form input fields
        resetForm();

        // 2. Trigger React-Toastify
        toast.success("Liability added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <ToastContainer />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Add New Liability</h1>
          <p className="text-sm text-slate-500">
            Record liabilities across services, suppliers, cash, and bank accounts
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
            <h2 className="text-base font-semibold text-white">Liability Voucher Form</h2>
          </div>

          <LiabilityForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddLiability;