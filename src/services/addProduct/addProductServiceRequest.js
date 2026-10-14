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

// Group fetch korar jonno
export const fetchGroups = async () => {
  const response = await fetch(`${API_URL}/product-groups`);
  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }
  const data = await response.json();
  return data.data || data;
};

// Sub-group fetch korar jonno
export const fetchSubGroups = async () => {
  const response = await fetch(`${API_URL}/product-subgroups`);
  if (!response.ok) {
    throw new Error("Failed to fetch subgroups");
  }
  const data = await response.json();
  return data.data || data;
};

// Notun product create korar jonno
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products/create-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create product";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data || data;
};

// Product update korar jonno (Fixed to handle payload structure properly)
export const updateProduct = async ({ id, payload }) => {
  // Payload ke backend-er validation schema onujayi wrap kora hocche
  const requestBody = payload.product ? payload : { product: payload };

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMessage = "Failed to update product";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error?.message || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data || data;
};

// Product delete korar jonno
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete product";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data || data;
};