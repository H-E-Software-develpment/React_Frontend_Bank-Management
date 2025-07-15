import api from "../api/axiosConfig";

// Only Admin and Worker can access this endpoint
export const getUsersForAdmin = async () => {
  try {
    const response = await api.get("/user/getUsersForAdmin");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching users for admin",
    );
  }
};

export const findUsers = async (filters) => {
  try {
    const response = await api.post("/user/findUsers", filters);
    return response.data;
  } catch (error) {
    console.error("Error in findUsers:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error finding users");
  }
};



export const createUserForAdmin = async (userData) => {
  try {
    const response = await api.post("/user/createUserForAdmin", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating user");
  }
};

export const editUser = async (uid, userData) => {
  try {
    const response = await api.put(`/user/editUser/${uid}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error editing user");
  }
};

export const deleteUser = async (uid) => {
  try {
    const response = await api.delete(`/user/deleteUser/${uid}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting user");
  }
};
export const editUserProfile = async (profileData) => {
  try {
    const response = await api.put("/user/editUserProfile", profileData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error editing profile information",
    );
  }
};

export const changeUserPassword = async (passwordData) => {
  try {
    const response = await api.put(
      "/user/changeUserPassword",
      passwordData,
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error changing password");
  }
};

export const showProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await api.get("/user/showProfile");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error fetching profile",
    );
  }
};