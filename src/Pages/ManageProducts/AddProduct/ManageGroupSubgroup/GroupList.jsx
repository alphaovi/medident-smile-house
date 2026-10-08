import { useState } from "react";
import { Layers, Edit2, Trash2, Check, X, CornerDownRight } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const GroupList = ({ groups, subgroups, isLoading, deleteGroup, deleteSubgroup, updateSubgroup, fetchAllData, onDataChange }) => {
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");

  const [editingSubId, setEditingSubId] = useState(null);
  const [editedSubName, setEditedSubName] = useState("");

  // গ্রুপ ডিলিট করার ফাংশন
  const handleDeleteGroup = (groupId) => {
    Swal.fire({
      title: "Delete Group?",
      text: "All associated subgroups under this group may be affected.",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-lg p-5 max-w-sm text-left font-sans shadow-xl border border-gray-200",
        title: "text-xl font-normal text-gray-800 text-left border-b border-gray-200 pb-3 mb-4",
        htmlContainer: "text-gray-600 text-base text-left my-4 font-normal",
        actions: "flex justify-end gap-2 border-t border-gray-200 pt-3 mt-4 w-full",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded border-0 text-sm",
        cancelButton: "bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGroup(groupId);
          toast.success("Group deleted successfully!");
          fetchAllData();
          if (onDataChange) onDataChange();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete group");
        }
      }
    });
  };

  // সাব-গ্রুপ ডিলিট করার ফাংশন
  const handleDeleteSubGroup = (subId) => {
    Swal.fire({
      title: "Delete Subgroup?",
      text: "Are you sure you want to delete this subgroup?",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-lg p-5 max-w-sm text-left font-sans shadow-xl border border-gray-200",
        title: "text-xl font-normal text-gray-800 text-left border-b border-gray-200 pb-3 mb-4",
        htmlContainer: "text-gray-600 text-base text-left my-4 font-normal",
        actions: "flex justify-end gap-2 border-t border-gray-200 pt-3 mt-4 w-full",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded border-0 text-sm",
        cancelButton: "bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSubgroup(subId);
          toast.success("Subgroup deleted successfully!");
          fetchAllData();
          if (onDataChange) onDataChange();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete subgroup");
        }
      }
    });
  };

  // সাব-গ্রুপ এডিট সেভ করার ফাংশন
  const handleSaveSubEdit = async (subId) => {
    if (!editedSubName.trim()) {
      toast.error("Subgroup name cannot be empty!");
      return;
    }

    try {
      await updateSubgroup(subId, { subGroupName: editedSubName.trim() });
      toast.success("Subgroup updated successfully!");
      setEditingSubId(null);
      setEditedSubName("");
      fetchAllData();
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subgroup");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Existing Hierarchy List</h3>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 bg-white">
        {isLoading && groups.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading data...</div>
        ) : groups.length > 0 ? (
          groups.map((groupItem) => {
            const groupSubs = subgroups.filter(
              (sub) => sub.group === groupItem._id || sub.group?._id === groupItem._id
            );

            return (
              <div key={groupItem._id} className="p-4 hover:bg-gray-50/50 transition-colors space-y-3">
                {/* Group Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1">
                    <Layers className="size-4 text-teal-600 shrink-0" />
                    {editingGroupId === groupItem._id ? (
                      <div className="flex items-center gap-2 flex-1 max-w-xs">
                        <input
                          type="text"
                          value={editedGroupName}
                          onChange={(e) => setEditedGroupName(e.target.value)}
                          className="input input-xs input-bordered w-full bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingGroupId(null)}
                          className="btn btn-xs bg-teal-600 text-white border-0"
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingGroupId(null)}
                          className="btn btn-xs btn-ghost text-gray-500"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-800 text-sm">{groupItem.groupName}</span>
                    )}
                  </div>

                  {/* Group Actions */}
                  {editingGroupId !== groupItem._id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteGroup(groupItem._id)}
                        className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Group"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Subgroups List */}
                {groupSubs.length > 0 && (
                  <div className="pl-6 space-y-2 border-l-2 border-teal-100 ml-2">
                    {groupSubs.map((sub) => {
                      const isEditingThisSub = editingSubId === sub._id;

                      return (
                        <div key={sub._id} className="flex items-center justify-between bg-gray-50/80 px-3 py-1.5 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 flex-1">
                            <CornerDownRight className="size-3.5 text-gray-400 shrink-0" />
                            {isEditingThisSub ? (
                              <div className="flex items-center gap-2 flex-1 max-w-xs">
                                <input
                                  type="text"
                                  value={editedSubName}
                                  onChange={(e) => setEditedSubName(e.target.value)}
                                  className="input input-xs input-bordered w-full bg-white"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveSubEdit(sub._id)}
                                  className="btn btn-xs bg-emerald-600 text-white border-0"
                                >
                                  <Check className="size-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingSubId(null)}
                                  className="btn btn-xs btn-ghost text-gray-500"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-700 font-medium">{sub.subGroupName}</span>
                            )}
                          </div>

                          {!isEditingThisSub && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingSubId(sub._id);
                                  setEditedSubName(sub.subGroupName);
                                }}
                                className="p-1.5 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Edit Subgroup"
                              >
                                <Edit2 className="size-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubGroup(sub._id)}
                                className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Subgroup"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">No groups available.</div>
        )}
      </div>
    </div>
  );
};

export default GroupList;