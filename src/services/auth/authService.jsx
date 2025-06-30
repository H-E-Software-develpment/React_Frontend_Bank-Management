import api from "../api/axiosConfig";

export const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login Failed");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
