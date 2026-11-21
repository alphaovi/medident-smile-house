const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_Test_API_URL ||
  "http://localhost:5002/api/v1";

export const fetchBankDetails = async () => {
  const response = await fetch(`${API_URL}/banks-detail`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch bank details");
  }
  return Array.isArray(data) ? data : data?.data || [];
};

export const createBankDetail = async (bankPayload) => {
  const response = await fetch(`${API_URL}/banks-detail/create-bank-detail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bankPayload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create bank detail");
  }
  return data.data || data;
};

export const updateBankDetail = async (id, bankPayload) => {
  const response = await fetch(`${API_URL}/banks-detail/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bankPayload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update bank detail");
  }
  return data.data || data;
};

export const deleteBankDetail = async (id) => {
  const response = await fetch(`${API_URL}/banks-detail/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete bank detail");
  }
  return data.data || data;
};

export const bankDetailService = {
  getAllBankDetails: fetchBankDetails,
  fetchBankDetails,
  createBankDetail,
  updateBankDetail,
  deleteBankDetail,
};