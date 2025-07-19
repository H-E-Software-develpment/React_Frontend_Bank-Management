import api from "../api/axiosConfig";

// Worker/Admin functions
export const createDeposit = async (depositData) => {
  try {
    const response = await api.post("/movement/createDeposit", depositData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al crear el depósito" };
  }
};

export const findMovements = async (searchData) => {
  try {
    const response = await api.post("/movement/findMovements", searchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al buscar movimientos" };
  }
};

export const getAccountsByMovements = async (orderData) => {
  try {
    const response = await api.post(
      "/movement/getAccountsByMovements",
      orderData,
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Error al obtener cuentas por movimientos",
      }
    );
  }
};

// Client functions
export const createTransfer = async (transferData) => {
  try {
    const response = await api.post("/movement/createTransfer", transferData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error al crear la transferencia" }
    );
  }
};

export const findMovementsForClient = async (searchData) => {
  try {
    const response = await api.post(
      "/movement/findMovementsForClient",
      searchData,
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Error al buscar movimientos del cliente",
      }
    );
  }
};
