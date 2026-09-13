import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Building2,
  Phone,
  MapPin,
  Search,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SupplierModal from "./SupplierModal";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [currentId, setCurrentId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");

  // Fetch JSON data using useEffect from public folder
  useEffect(() => {
    fetch("/suppliersData.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch suppliers data");
        return res.json();
      })
      .then((data) => {
        setSuppliers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load suppliers data!");
        setLoading(false);
      });
  }, []);

  // Open Modal for Adding New Supplier
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSupplierName("");
    setSupplierPhone("");
    setSupplierAddress("");

    const nextIdNum = suppliers.length + 1;
    const generatedId = `SUP-${String(nextIdNum).padStart(3, "0")}`;
    setCurrentId(generatedId);

    setIsModalOpen(true);
  };

  // Open Modal for Editing Existing Supplier
  const handleOpenEditModal = (supplier) => {
    setIsEditing(true);
    setCurrentId(supplier.supplierID);
    setSupplierName(supplier.supplierName);
    setSupplierPhone(supplier.supplierPhone);
    setSupplierAddress(supplier.supplierAddress);
    setIsModalOpen(true);
  };

  // Save or Update Supplier Form Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierName || !supplierPhone || !supplierAddress) {
      toast.warning("Please fill in all fields!");
      return;
    }

    if (isEditing) {
      const updatedList = suppliers.map((sup) =>
        sup.supplierID === currentId
          ? { ...sup, supplierName, supplierPhone, supplierAddress }
          : sup
      );
      setSuppliers(updatedList);
      toast.success("Supplier updated successfully!");
    } else {
      const newSupplier = {
        supplierID: currentId,
        supplierName,
        supplierPhone,
        supplierAddress,
        status: true, // নতুন সাপ্লায়ার ডিফল্টভাবে active থাকবে
      };
      setSuppliers([newSupplier, ...suppliers]);
      toast.success("New supplier added successfully!");
    }

    setIsModalOpen(false);
  };

  // Toggle Supplier Status (Active / Inactive) from Action button
  const handleToggleStatus = (id) => {
    const updatedList = suppliers.map((sup) => {
      if (sup.supplierID === id) {
        const newStatus = !sup.status;
        if (newStatus) {
          toast.success(`${sup.supplierName} is now Active!`);
        } else {
          toast.info(`${sup.supplierName} is now Inactive!`);
        }
        return { ...sup, status: newStatus };
      }
      return sup;
    });
    setSuppliers(updatedList);
  };

  // Filter suppliers based on search query (All suppliers remain visible)
  const filteredSuppliers = suppliers.filter(
    (sup) =>
      sup.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.supplierID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.supplierPhone.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Manage Suppliers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add, edit, and organize your business suppliers status
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search by name, ID or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Suppliers Table List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <th className="py-4 px-6 font-semibold">Supplier ID</th>
                <th className="py-4 px-6 font-semibold">Supplier Name</th>
                <th className="py-4 px-6 font-semibold">Phone No</th>
                <th className="py-4 px-6 font-semibold">Address</th>
                <th className="py-4 px-6 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Loading suppliers from JSON...
                  </td>
                </tr>
              ) : filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((sup) => (
                  <tr
                    key={sup.supplierID}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-indigo-600 dark:text-indigo-400">
                      {sup.supplierID}
                    </td>
                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{sup.supplierName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {sup.supplierPhone}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-xs">
                          {sup.supplierAddress}
                        </span>
                      </div>
                    </td>
                    {/* Action Column with Fixed-width Active/Inactive Status Button */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(sup)}
                          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Edit Supplier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(sup.supplierID)}
                          className={`w-24 py-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer inline-flex items-center justify-center ${
                            sup.status
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400"
                          }`}
                          title="Click to toggle status"
                        >
                          {sup.status ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal Component */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={isEditing}
        currentId={currentId}
        supplierName={supplierName}
        setSupplierName={setSupplierName}
        supplierPhone={supplierPhone}
        setSupplierPhone={setSupplierPhone}
        supplierAddress={supplierAddress}
        setSupplierAddress={setSupplierAddress}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageSuppliers;