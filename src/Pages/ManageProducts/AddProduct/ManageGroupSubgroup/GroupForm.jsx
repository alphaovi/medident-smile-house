import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const GroupForm = ({ createGroup, fetchAllData, onDataChange }) => {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const generatedId = `grp-${Date.now().toString().slice(-6)}`;
    setGroupId(generatedId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupId.trim() || !groupName.trim()) {
      toast.error("Both Group ID and Group Name are required!");
      return;
    }

    try {
      await createGroup({
        productGroup: {
          id: groupId.trim(),
          groupName: groupName.trim(),
        },
      });

      toast.success("Product group created successfully!");
      setGroupName("");
      setGroupId(`grp-${Date.now().toString().slice(-6)}`);
      fetchAllData();
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(error.response?.message || error.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Add New Group</h3>
      
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Group ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="e.g. grp-001"
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-mono"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Group Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name (e.g. Dental)"
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors mt-2"
      >
        + Add Group
      </button>
    </form>
  );
};

export default GroupForm;