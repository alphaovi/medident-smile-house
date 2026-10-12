import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1";

export const useEmployeeManagementService = () => {
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/employees`);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch employees");
            }
            setEmployees(result.data || []);
        } catch (err) {
            console.error("Error fetching employees:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCustomers = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/customers`);
            const result = await response.json();
            if (response.ok) {
                setCustomers(result.data || []);
            }
        } catch (err) {
            console.error("Error fetching customers:", err);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchCustomers();
    }, [fetchEmployees, fetchCustomers]);

    const createEmployee = async (employeeData) => {
        try {
            const response = await fetch(`${API_URL}/employees/create-employee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employee: employeeData }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Validation error");
            }
            await fetchEmployees();
            return { success: true, data: result.data };
        } catch (err) {
            console.error("Error creating employee:", err);
            return { success: false, message: err.message };
        }
    };

    const updateEmployee = async (employeeId, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/employees/${employeeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employee: updatedData }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Validation error");
            }
            await fetchEmployees();
            await fetchCustomers();
            return { success: true, data: result.data };
        } catch (err) {
            console.error("Error updating employee:", err);
            return { success: false, message: err.message };
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            const response = await fetch(`${API_URL}/employees/${employeeId}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to delete employee");
            }
            await fetchEmployees();
            await fetchCustomers();
            return { success: true };
        } catch (err) {
            console.error("Error deleting employee:", err);
            return { success: false, message: err.message };
        }
    };

    return {
        employees,
        customers,
        loading,
        error,
        fetchEmployees,
        fetchCustomers,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    };
};