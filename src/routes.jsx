import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import UserDashboard from "./pages/Client/UserDashboard";
import UserProfile from "./pages/Profile/UserProfile";
import EditProfile from "./pages/Profile/EditProfile";
import CreateUser from "./pages/Admin/CreateUser";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["ADMINISTRATOR"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/worker"
      element={
        <ProtectedRoute allowedRoles={["WORKER"]}>
          <WorkerDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/client"
      element={
        <ProtectedRoute allowedRoles={["CLIENT"]}>
          <UserDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute allowedRoles={["ADMINISTRATOR", "WORKER", "CLIENT"]}>
          <UserProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/edituser"
      element={
        <ProtectedRoute allowedRoles={["ADMINISTRATOR", "WORKER"]}>
          <EditProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/createuser"
      element={
        <ProtectedRoute allowedRoles={["ADMINISTRATOR"]}>
          <CreateUser />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<LoginPage />} />
  </Routes>
);

export default AppRoutes;
