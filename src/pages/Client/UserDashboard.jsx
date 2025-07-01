import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showProfile } from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await showProfile();
      setProfile(response.user);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Cliente</h1>
          <div className="header-user-info">
            <span>Bienvenido, {user?.name}</span>
            <div className="header-actions">
              <button
                className="icon-button profile-btn"
                onClick={goToProfile}
                title="Ver mi perfil"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <section className="welcome-section">
            <div className="welcome-card">
              <h2>¡Bienvenido a tu Panel de Cliente!</h2>
              <p>Puedes gestionar tu perfil y ver tu información personal.</p>
            </div>
          </section>

          <section className="quick-actions">
            <h2>Acciones Rápidas</h2>
            <div className="actions-grid">
              <div className="action-card" onClick={goToProfile}>
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                </div>
                <h3>Ver Mi Perfil</h3>
                <p>Consulta y modifica tu información personal</p>
              </div>

              <div className="action-card disabled">
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
                  </svg>
                </div>
                <h3>Cuentas Bancarias</h3>
                <p>Gestiona tus cuentas bancarias (Próximamente)</p>
              </div>

              <div className="action-card disabled">
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,6V18H21V6H3M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
                  </svg>
                </div>
                <h3>Transacciones</h3>
                <p>Consulta tu historial de transacciones (Próximamente)</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
