const API_URL = import.meta.env.VITE_API_URL;

// Sob product fetch korar jonno
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.data || data;
};