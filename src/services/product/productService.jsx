import api from "../api/axiosConfig";

// Create a new product (ADMINISTRATOR only)
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/product/createProduct", productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear producto");
  }
};

// Edit an existing product (ADMINISTRATOR only)
export const editProduct = async (pid, productData) => {
  try {
    const response = await api.put(`/product/editProduct/${pid}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al editar producto",
    );
  }
};

// Delete a product (ADMINISTRATOR only)
export const deleteProduct = async (pid) => {
  try {
    const response = await api.delete(`/product/deleteProduct/${pid}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar producto",
    );
  }
};

// Find products (ALL ROLES)
export const findProducts = async (filters = {}) => {
  try {
    const response = await api.post("/product/findProducts", filters);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al buscar productos",
    );
  }
};
