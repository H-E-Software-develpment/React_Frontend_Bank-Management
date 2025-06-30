import { useState } from "react";
import { login, logout } from "../../../services/auth/authService";

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await login(username, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return { handleLogin, handleLogout, error, loading };
};
