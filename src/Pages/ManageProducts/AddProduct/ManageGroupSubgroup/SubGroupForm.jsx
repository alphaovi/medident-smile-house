import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

const SubgroupForm = ({ groups, createSubgroup, onDataChange }) => {
  const [subgroupId, setSubgroupId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newSubGroupName, setNewSubGroupName] = useState("");

  useEffect(() => {
    const generatedId = `sub-${Date.now().toString().slice(-6)}`;
    setSubgroupId(generatedId);
  }, []);

  const handleAddSubGroup = async (e) => {
    e.preventDefault();
    if (!subgroupId.trim()) {
      toast.error("Subgroup ID is required!");
      return;
    }
    if (!selectedGroupId) {
      toast.error("Please select a target group!");
      return;
    }
    if (!newSubGroupName.trim()) {
      toast.error("Please enter a subgroup name!");
      return;
    }

    try {
      await createSubgroup({
        productSubgroup: {
          id: subgroupId.trim(),
          group: selectedGroupId,
          subGroupName: newSubGroupName.trim(),
        },
      });

      // Form reset
      setNewSubGroupName("");
      setSubgroupId(`sub-${Date.now().toString().slice(-6)}`);
      
      if (onDataChange) onDataChange();
    } catch (error) {
      // Error handling is already managed in parent handler, but kept as a safeguard
    }
  };

  return (
    <form onSubmit={handleAddSubGroup} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Add Subgroup</h3>
      
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Subgroup ID</label>
        <input
          type="text"
          value={subgroupId}
          onChange={(e) => setSubgroupId(e.target.value)}
          placeholder="e.g. sub-001"
          className="w-full px-3 py-2 border rounded-md text-sm bg-white font-mono"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Select Group</label>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm bg-white"
          required
        >
          <option value="">Select Group...</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.groupName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Subgroup Name</label>
        <input
          type="text"
          placeholder="Subgroup Name (e.g. Shade A1)"
          value={newSubGroupName}
          onChange={(e) => setNewSubGroupName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm bg-white"
          required
        />
      </div>

      <button type="submit" className="w-full btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-1.5 mt-2">
        <Plus className="size-4" /> Add Subgroup
      </button>
    </form>
  );
};

export default SubgroupForm;