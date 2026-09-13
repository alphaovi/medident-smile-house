import { useState } from "react";
import { X, Plus, FolderPlus, Layers, Edit2, Trash2, Check, CornerDownRight } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManageGroupModal = ({ isOpen, onClose, groups = [], setGroups }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupForSub, setSelectedGroupForSub] = useState("");
  const [newSubGroupName, setNewSubGroupName] = useState("");

  // Edit States
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");

  const [editingSub, setEditingSub] = useState({ groupIdx: null, subIdx: null });
  const [editedSubName, setEditedSubName] = useState("");

  if (!isOpen) return null;

  // ১. নতুন গ্রুপ যোগ করা
  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name!");
      return;
    }

    const groupExists = groups.some(
      (g) => (g.groupName || g.name || g.group || "").toLowerCase() === newGroupName.trim().toLowerCase()
    );

    if (groupExists) {
      toast.warning("This group already exists!");
      return;
    }

    const newGroupObj = {
      group: newGroupName.trim(),
      subGroup: []
    };

    setGroups((prev) => [...prev, newGroupObj]);
    setNewGroupName("");
    toast.success("Group added successfully! 🎉");
  };

  // ২. সাব-গ্রুপ যোগ করা
  const handleAddSubGroup = (e) => {
    e.preventDefault();
    if (!selectedGroupForSub) {
      toast.error("Please select a group first!");
      return;
    }
    if (!newSubGroupName.trim()) {
      toast.error("Please enter a subgroup name!");
      return;
    }

    setGroups((prev) =>
      prev.map((g) => {
        const gName = g.groupName || g.name || g.group || "";
        if (gName.toLowerCase() === selectedGroupForSub.toLowerCase()) {
          const currentSubGroups = g.subGroup || g.subgroups || g.subGroupsList || [];
          
          const subExists = currentSubGroups.some(
            (sub) => (typeof sub === 'string' ? sub : (sub.name || sub.subGroupName || "")).toLowerCase() === newSubGroupName.trim().toLowerCase()
          );

          if (subExists) {
            toast.warning("This subgroup already exists in this group!");
            return g;
          }

          return {
            ...g,
            subGroup: [...currentSubGroups, newSubGroupName.trim()]
          };
        }
        return g;
      })
    );

    setNewSubGroupName("");
    toast.success("Subgroup added successfully! 🚀");
  };

  // ৩. গ্রুপ ডিলিট করা (কনফার্মেশন সহ)
  const handleDeleteGroup = (groupIndex) => {
    Swal.fire({
      title: "Delete Group?",
      text: "All associated subgroups under this group will also be removed.",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: false,
      customClass: {
        popup: "rounded-lg p-5 max-w-sm text-left font-sans shadow-xl border border-gray-200",
        title: "text-xl font-normal text-gray-800 text-left border-b border-gray-200 pb-3 mb-4",
        htmlContainer: "text-gray-600 text-base text-left my-4 font-normal",
        actions: "flex justify-end gap-2 border-t border-gray-200 pt-3 mt-4 w-full",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded border-0 text-sm",
        cancelButton: "bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setGroups((prev) => prev.filter((_, idx) => idx !== groupIndex));
        toast.success("Group deleted successfully!");
      }
    });
  };

  // ৪. সাব-গ্রুপ ডিলিট করা (কনফার্মেশন সহ)
  const handleDeleteSubGroup = (groupIndex, subIndex) => {
    Swal.fire({
      title: "Delete Subgroup?",
      text: "Are you sure you want to delete this subgroup?",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: false,
      customClass: {
        popup: "rounded-lg p-5 max-w-sm text-left font-sans shadow-xl border border-gray-200",
        title: "text-xl font-normal text-gray-800 text-left border-b border-gray-200 pb-3 mb-4",
        htmlContainer: "text-gray-600 text-base text-left my-4 font-normal",
        actions: "flex justify-end gap-2 border-t border-gray-200 pt-3 mt-4 w-full",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded border-0 text-sm",
        cancelButton: "bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setGroups((prev) =>
          prev.map((g, idx) => {
            if (idx === groupIndex) {
              const currentSubs = g.subGroup || g.subgroups || g.subGroupsList || [];
              const updatedSubs = currentSubs.filter((_, sIdx) => sIdx !== subIndex);
              return { ...g, subGroup: updatedSubs };
            }
            return g;
          })
        );
        toast.success("Subgroup deleted successfully!");
      }
    });
  };

  // ৫. গ্রুপ এডিট সংরক্ষণ করা
  const handleSaveGroupEdit = (groupIndex) => {
    if (!editedGroupName.trim()) {
      toast.error("Group name cannot be empty!");
      return;
    }

    setGroups((prev) =>
      prev.map((g, idx) => {
        if (idx === groupIndex) {
          return { ...g, group: editedGroupName.trim(), groupName: editedGroupName.trim() };
        }
        return g;
      })
    );

    setEditingGroupIndex(null);
    setEditedGroupName("");
    toast.success("Group updated successfully!");
  };

  // ৬. সাব-গ্রুপ এডিট সংরক্ষণ করা
  const handleSaveSubEdit = (groupIndex, subIndex) => {
    if (!editedSubName.trim()) {
      toast.error("Subgroup name cannot be empty!");
      return;
    }

    setGroups((prev) =>
      prev.map((g, idx) => {
        if (idx === groupIndex) {
          const currentSubs = [...(g.subGroup || g.subgroups || g.subGroupsList || [])];
          currentSubs[subIndex] = editedSubName.trim();
          return { ...g, subGroup: currentSubs };
        }
        return g;
      })
    );

    setEditingSub({ groupIdx: null, subIdx: null });
    setEditedSubName("");
    toast.success("Subgroup updated successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FolderPlus className="size-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-800">Manage Groups & Subgroups</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Add Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Add Group Form */}
            <form onSubmit={handleAddGroup} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Add New Group</h3>
              <input
                type="text"
                placeholder="Group Name (e.g. Ceramics)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full input input-sm input-bordered focus:outline-teal-600 bg-white"
              />
              <button type="submit" className="w-full btn btn-sm bg-teal-600 hover:bg-teal-700 text-white border-0 gap-1.5">
                <Plus className="size-4" /> Add Group
              </button>
            </form>

            {/* Add Subgroup Form */}
            <form onSubmit={handleAddSubGroup} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Add Subgroup to Group</h3>
              <select
                value={selectedGroupForSub}
                onChange={(e) => setSelectedGroupForSub(e.target.value)}
                className="w-full select select-sm select-bordered focus:outline-teal-600 bg-white"
              >
                <option value="">Select Target Group...</option>
                {groups.map((g, idx) => {
                  const gName = g.groupName || g.name || g.group || "";
                  return (
                    <option key={idx} value={gName}>
                      {gName}
                    </option>
                  );
                })}
              </select>
              <input
                type="text"
                placeholder="Subgroup Name (e.g. Shade A1)"
                value={newSubGroupName}
                onChange={(e) => setNewSubGroupName(e.target.value)}
                className="w-full input input-sm input-bordered focus:outline-teal-600 bg-white"
              />
              <button type="submit" className="w-full btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-1.5">
                <Plus className="size-4" /> Add Subgroup
              </button>
            </form>
          </div>

          {/* Existing Groups & Subgroups List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Existing Hierarchy List</h3>
            
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 bg-white">
              {groups && groups.length > 0 ? (
                groups.map((groupItem, gIdx) => {
                  const gName = groupItem.groupName || groupItem.name || groupItem.group || "Unnamed Group";
                  const subs = groupItem.subGroup || groupItem.subgroups || groupItem.subGroupsList || [];

                  return (
                    <div key={gIdx} className="p-4 hover:bg-gray-50/50 transition-colors space-y-3">
                      
                      {/* Group Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 flex-1">
                          <Layers className="size-4 text-teal-600 shrink-0" />
                          {editingGroupIndex === gIdx ? (
                            <div className="flex items-center gap-2 flex-1 max-w-xs">
                              <input
                                type="text"
                                value={editedGroupName}
                                onChange={(e) => setEditedGroupName(e.target.value)}
                                className="input input-xs input-bordered w-full bg-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveGroupEdit(gIdx)}
                                className="btn btn-xs bg-teal-600 hover:bg-teal-700 text-white border-0"
                              >
                                <Check className="size-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingGroupIndex(null)}
                                className="btn btn-xs btn-ghost text-gray-500"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-semibold text-gray-800 text-sm">{gName}</span>
                          )}
                        </div>

                        {/* Group Actions */}
                        {editingGroupIndex !== gIdx && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingGroupIndex(gIdx);
                                setEditedGroupName(gName);
                              }}
                              className="p-1.5 rounded text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                              title="Edit Group"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGroup(gIdx)}
                              className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Group"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Subgroups List */}
                      {subs.length > 0 && (
                        <div className="pl-6 space-y-2 border-l-2 border-teal-100 ml-2">
                          {subs.map((sub, sIdx) => {
                            const subName = typeof sub === 'string' ? sub : (sub.name || sub.subGroupName || sub.title);
                            const isEditingThisSub = editingSub.groupIdx === gIdx && editingSub.subIdx === sIdx;

                            return (
                              <div key={sIdx} className="flex items-center justify-between bg-gray-50/80 px-3 py-1.5 rounded-lg border border-gray-100">
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
                                        onClick={() => handleSaveSubEdit(gIdx, sIdx)}
                                        className="btn btn-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                      >
                                        <Check className="size-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingSub({ groupIdx: null, subIdx: null })}
                                        className="btn btn-xs btn-ghost text-gray-500"
                                      >
                                        <X className="size-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-700 font-medium">{subName}</span>
                                  )}
                                </div>

                                {/* Subgroup Actions */}
                                {!isEditingThisSub && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingSub({ groupIdx: gIdx, subIdx: sIdx });
                                        setEditedSubName(subName);
                                      }}
                                      className="p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                      title="Edit Subgroup"
                                    >
                                      <Edit2 className="size-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubGroup(gIdx, sIdx)}
                                      className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 border-0"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManageGroupModal;