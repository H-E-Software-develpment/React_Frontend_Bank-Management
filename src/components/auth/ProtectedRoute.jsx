import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !user) {
        navigate("/login");
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        navigate("/unauthorized");
        return;
      }

      setIsVerified(true);
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (!isVerified) {
    return <LoadingSpinner />;
  }

  return children;
};

export default ProtectedRoute;