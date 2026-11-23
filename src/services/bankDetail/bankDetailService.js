import { apiRequest } from "../auth/api";

export const fetchBankDetails = async () => {
  const res = await apiRequest("/banks-detail", {
    method: "GET",
  });
  return Array.isArray(res) ? res : res?.data || [];
};

export const createBankDetail = async (bankPayload) => {
  const res = await apiRequest("/banks-detail/create-bank-detail", {
    method: "POST",
    body: JSON.stringify(bankPayload),
  });
  return res?.data || res;
};

export const updateBankDetail = async (id, bankPayload) => {
  const res = await apiRequest(`/banks-detail/${id}`, {
    method: "PATCH",
    body: JSON.stringify(bankPayload),
  });
  return res?.data || res;
};

export const deleteBankDetail = async (id) => {
  const res = await apiRequest(`/banks-detail/${id}`, {
    method: "DELETE",
  });
  return res?.data || res;
};

export const bankDetailService = {
  getAllBankDetails: fetchBankDetails,
  fetchBankDetails,
  createBankDetail,
  updateBankDetail,
  deleteBankDetail,
};