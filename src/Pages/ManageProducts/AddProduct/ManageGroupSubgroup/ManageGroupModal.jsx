import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { X, FolderPlus } from "lucide-react";
import { toast } from "react-toastify";

import GroupForm from "./GroupForm";
import SubgroupForm from "./SubGroupForm";
import GroupList from "./GroupList";

const API_URL = import.meta.env.VITE_API_URL;

const ManageGroupModal = ({ isOpen, onClose, onDataChange }) => {
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data Fetching
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupRes, subRes] = await Promise.all([
        axios.get(`${API_URL}/product-groups`),
        axios.get(`${API_URL}/product-subgroups`),
      ]);

      setGroups(groupRes.data.data || groupRes.data || []);
      setSubgroups(subRes.data.data || subRes.data || []);
    } catch (error) {
      toast.error("Failed to load groups and subgroups!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen, fetchAllData]);

  // Group Create
  const handleCreateGroup = async (groupPayload) => {
    try {
      const response = await axios.post(`${API_URL}/product-groups/create-product-group`, groupPayload);
      const newGroup = response.data.data || response.data;
      
      setGroups((prev) => [...prev, newGroup]);
      toast.success("Group created successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group!");
      throw error;
    }
  };

  // Group Update
  const handleUpdateGroup = async (groupIdOrMongoId, updatePayload) => {
    try {
      const targetGroup = groups.find(
        (g) => g.id === groupIdOrMongoId || g._id === groupIdOrMongoId
      );

      const updateKey = targetGroup ? targetGroup.id : groupIdOrMongoId;

      const response = await axios.patch(`${API_URL}/product-groups/${updateKey}`, {
        productGroup: updatePayload,
      });
      const updatedGroup = response.data.data || response.data;

      setGroups((prev) =>
        prev.map((g) => (g.id === updateKey || g._id === groupIdOrMongoId ? updatedGroup : g))
      );

      toast.success("Group updated successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update group!");
      throw error;
    }
  };

  // Group Delete
  const handleDeleteGroup = async (groupIdOrMongoId) => {
    try {
      const targetGroup = groups.find(
        (g) => g.id === groupIdOrMongoId || g._id === groupIdOrMongoId || g._id?.toString() === groupIdOrMongoId
      );

      if (!targetGroup) {
        toast.error("Group not found!");
        return;
      }

      const deleteKey = targetGroup.id; 
      if (!deleteKey) {
        toast.error("Group ID is missing!");
        return;
      }

      const targetGroupId = targetGroup._id;
      const targetGroupCustomId = targetGroup.id;

      await axios.delete(`${API_URL}/product-groups/${deleteKey}`);
      
      setGroups((prev) => prev.filter((group) => group.id !== deleteKey && group._id !== groupIdOrMongoId));
      setSubgroups((prev) => prev.filter((sub) => {
        const subGroupRef = typeof sub.group === "string" ? sub.group : sub.group?._id || sub.group?.id;
        return subGroupRef !== targetGroupId && subGroupRef !== targetGroupCustomId;
      }));

      toast.success("Group deleted successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete group!");
    }
  };

  // Subgroup Create
  const handleCreateSubgroup = async (subgroupPayload) => {
    try {
      const response = await axios.post(`${API_URL}/product-subgroups/create-product-subgroup`, subgroupPayload);
      const newSubgroup = response.data.data || response.data;

      setSubgroups((prev) => [...prev, newSubgroup]);
      toast.success("Subgroup created successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create subgroup!");
      throw error;
    }
  };

  // 🟢 Subgroup Delete (Fixed to properly prioritize custom string ID 'sub-xxxx' with automatic fallback)
  const handleDeleteSubgroup = async (subgroupIdOrMongoId) => {
    try {
      const targetSubgroup = subgroups.find(
        (sub) => sub.id === subgroupIdOrMongoId || sub._id === subgroupIdOrMongoId || sub._id?.toString() === subgroupIdOrMongoId
      );

      if (!targetSubgroup) {
        toast.error("Subgroup not found!");
        return;
      }

      // প্রথমে কাস্টম আইডি (sub.id) দিয়ে ট্রাই করবে, না থাকলে _id ব্যবহার করবে
      const primaryKey = targetSubgroup.id || targetSubgroup._id;
      const secondaryKey = targetSubgroup.id ? targetSubgroup._id : null;

      if (!primaryKey) {
        toast.error("Subgroup ID is missing!");
        return;
      }

      try {
        await axios.delete(`${API_URL}/product-subgroups/${primaryKey}`);
      } catch (firstErr) {
        // প্রথমটি ফেইল করলে এবং সেকেন্ডারি আইডি থাকলে সেটি দিয়ে আবার ট্রাই করবে
        if (secondaryKey) {
          await axios.delete(`${API_URL}/product-subgroups/${secondaryKey}`);
        } else {
          throw firstErr;
        }
      }

      setSubgroups((prev) =>
        prev.filter((sub) => sub.id !== targetSubgroup.id && sub._id !== targetSubgroup._id)
      );

      toast.success("Subgroup deleted successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Subgroup delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete subgroup!");
    }
  };

  // Subgroup Update
  const handleUpdateSubgroup = async (subgroupIdOrMongoId, updatePayload) => {
    try {
      const targetSubgroup = subgroups.find(
        (sub) => sub.id === subgroupIdOrMongoId || sub._id === subgroupIdOrMongoId
      );

      const updateKey = targetSubgroup ? targetSubgroup.id : subgroupIdOrMongoId;

      const formattedPayload = updatePayload.productSubgroup 
        ? updatePayload 
        : { productSubgroup: updatePayload };

      const response = await axios.patch(`${API_URL}/product-subgroups/${updateKey}`, formattedPayload);
      const updatedSub = response.data.data || response.data;

      setSubgroups((prev) =>
        prev.map((sub) => (sub.id === updateKey || sub._id === subgroupIdOrMongoId ? updatedSub : sub))
      );

      toast.success("Subgroup updated successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subgroup!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FolderPlus className="size-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Manage Groups & Subgroups
            </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GroupForm
              createGroup={handleCreateGroup}
              fetchAllData={fetchAllData}
              onDataChange={onDataChange}
            />
            <SubgroupForm
              groups={groups}
              createSubgroup={handleCreateSubgroup}
              fetchAllData={fetchAllData}
              onDataChange={onDataChange}
            />
          </div>

          <GroupList
            groups={groups}
            subgroups={subgroups}
            isLoading={loading}
            updateGroup={handleUpdateGroup}
            deleteGroup={handleDeleteGroup}
            deleteSubgroup={handleDeleteSubgroup}
            updateSubgroup={handleUpdateSubgroup}
            fetchAllData={fetchAllData}
            onDataChange={onDataChange}
          />
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