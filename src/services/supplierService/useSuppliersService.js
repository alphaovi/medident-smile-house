import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/suppliers`;

export const useSuppliersService = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all suppliers from backend database
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch suppliers");
      
      const formattedData = (data.data || []).map(sup => ({
        ...sup,
        supplierID: sup.supplierId,
        supplierPhone: sup.supplierPhoneNo,
        status: sup.isActive ?? true, // Mapping isActive to frontend status variable
      }));
      
      setSuppliers(formattedData);
    } catch (err) {
      console.error(err);
      toast.error("Could not load suppliers from server!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Create new supplier
  const addSupplier = async (supplierData) => {
    try {
      const payload = {
        supplier: {
          supplierId: supplierData.supplierID,
          supplierName: supplierData.supplierName,
          supplierPhoneNo: supplierData.supplierPhone,
          supplierAddress: supplierData.supplierAddress,
          isActive: supplierData.status ?? true,
        }
      };

      const res = await fetch(`${API_BASE_URL}/create-supplier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create supplier");

      const newSup = {
        ...result.data,
        supplierID: result.data.supplierId,
        supplierPhone: result.data.supplierPhoneNo,
        status: result.data.isActive,
      };

      setSuppliers((prev) => [newSup, ...prev]);
      toast.success("New supplier added successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add supplier");
      return false;
    }
  };

  // Update existing supplier
  const updateSupplier = async (supplierID, supplierData) => {
    try {
      const payload = {
        supplierName: supplierData.supplierName,
        supplierPhoneNo: supplierData.supplierPhone,
        supplierAddress: supplierData.supplierAddress,
        isActive: supplierData.status,
      };

      const res = await fetch(`${API_BASE_URL}/${supplierID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update supplier");

      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.supplierID === supplierID
            ? { ...sup, ...supplierData, status: supplierData.status }
            : sup
        )
      );
      toast.success("Supplier updated successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update supplier");
      return false;
    }
  };

  // Toggle Status (Active / Inactive) using isActive
  const toggleSupplierStatus = async (supplierID) => {
    const target = suppliers.find(s => s.supplierID === supplierID);
    if (!target) return;

    const newStatus = !target.status;
    
    try {
      const res = await fetch(`${API_BASE_URL}/${supplierID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.supplierID === supplierID ? { ...sup, status: newStatus, isActive: newStatus } : sup
        )
      );

      if (newStatus) {
        toast.success(`${target.supplierName} is now Active!`);
      } else {
        toast.info(`${target.supplierName} is now Inactive!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update status!");
    }
  };

  return {
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    toggleSupplierStatus,
    refreshSuppliers: fetchSuppliers,
  };
};