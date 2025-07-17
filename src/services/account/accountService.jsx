import api from "../api/axiosConfig";

// ADMINISTRATOR AND WORKER ROLE - Creates client with account
export const createClientWithAccount = async (userData) => {
  try {
    const response = await api.post(
      "/account/createClientWithAccount",
      userData,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error creating client with account",
    );
  }
};

// ADMINISTRATOR AND WORKER ROLE - Creates account for existing client
export const createAccount = async (accountData) => {
  try {
    const response = await api.post("/account/createAccount", accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating account");
  }
};

// ADMINISTRATOR AND WORKER ROLE - Closes an account
export const closeAccount = async (aid) => {
  try {
    const response = await api.delete(`/account/closeAccount/${aid}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error closing account");
  }
};

// ALL ROLES - Find accounts with filters
export const findAccounts = async (filterData) => {
  try {
    const response = await api.post("/account/findAccounts", filterData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error finding accounts");
  }
};

// CLIENT ROLE - Get all accounts for logged client
export const getAccountsForClient = async (queryParams = {}) => {
  try {
    const params = new URLSearchParams(queryParams);
    const response = await api.get(`/account/getAccountsForClient?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error getting client accounts",
    );
  }
};

// CLIENT ROLE - Add account to favorites
export const addFavoriteAccount = async (favoriteData) => {
  try {
    const response = await api.post(
      "/account/addFavoriteAccount",
      favoriteData,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error adding favorite account",
    );
  }
};

// CLIENT ROLE - Remove account from favorites
export const removeFavoriteAccount = async (aid) => {
  try {
    const response = await api.post("/account/removeFavoriteAccount", { aid });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error removing favorite account",
    );
  }
};
