import { useState } from "react";
import { Plus, Edit, Trash2, MapPin, Search, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStatesServiceCRUD } from "../../../services/supplierService/useStatesServiceCRUD"; // আপনার সার্ভিস ফাইলের পাথ অনুযায়ী ঠিক করে নিবেন

const State = () => {
  const { states, loading, addState, updateState, deleteState } =
    useStatesServiceCRUD();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [stateName, setStateName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Open Add Modal
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setStateName("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item._id || item.id);
    setStateName(item.stateName);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stateName.trim()) {
      toast.error("State name is required");
      return;
    }

    let success = false;
    if (isEditing) {
      success = await updateState(currentId, stateName);
    } else {
      success = await addState(stateName);
    }

    if (success) {
      setIsModalOpen(false);
      setStateName("");
    }
  };

  // Filtered States
  const filteredStates = states.filter((item) =>
    item.stateName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Manage States / Divisions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add, update or remove geographical states/divisions
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add State
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search state name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Table List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                <th className="py-4 px-6 font-semibold w-20">#</th>
                <th className="py-4 px-6 font-semibold">
                  State / Division Name
                </th>
                <th className="py-4 px-6 font-semibold text-center w-36">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    Loading states from database...
                  </td>
                </tr>
              ) : filteredStates.length > 0 ? (
                filteredStates.map((item, index) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{item.stateName}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Edit State"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteState(item._id || item.id)}
                          className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete State"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    No states found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                {isEditing ? "Edit State" : "Add New State"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  State / Division Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
                >
                  {isEditing ? "Update State" : "Save State"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default State;
