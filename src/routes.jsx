import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/protected" element={
          <ProtectedRoute>
            {/* Aquí va tu componente protegido */}
            <div>Área protegida</div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;