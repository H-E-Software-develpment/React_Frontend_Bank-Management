import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showProfile } from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import AccountsManager from "../../components/account/AccountsManager";
import TransferForm from "../../components/movement/TransferForm";
import MovementHistory from "../../components/movement/MovementHistory";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [showTransferForm, setShowTransferForm] = useState(false);

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

  const handleViewChange = (view) => {
    setActiveView(view);
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

      <nav className="dashboard-nav">
        <div className="nav-content">
          <button
            className={`nav-btn ${activeView === "dashboard" ? "active" : ""}`}
            onClick={() => handleViewChange("dashboard")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
            </svg>
            Inicio
          </button>
          <button
            className={`nav-btn ${activeView === "accounts" ? "active" : ""}`}
            onClick={() => handleViewChange("accounts")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
            Mis Cuentas
          </button>
          <button
            className={`nav-btn ${activeView === "transactions" ? "active" : ""}`}
            onClick={() => handleViewChange("transactions")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6V18H21V6H3M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
            Transacciones
          </button>
          <button
            className={`nav-btn ${activeView === "transfer" ? "active" : ""}`}
            onClick={() => handleViewChange("transfer")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,10V8L3,9L4,8V10L3,11L2,10M5,8V10L6,11L7,10V8L6,7L5,8M8.5,10H10.5C11,10 11.5,9.5 11.5,9C11.5,8.5 11,8 10.5,8H9.5C9,8 8.5,7.5 8.5,7C8.5,6.5 9,6 9.5,6H11.5V4.5H9.5C8.5,4.5 7.5,5.5 7.5,6.5V7C7.5,8 8.5,9 9.5,9H10.5C11,9 11.5,9.5 11.5,10C11.5,10.5 11,11 10.5,11H8.5V12.5H10.5C11.5,12.5 12.5,11.5 12.5,10.5V10C12.5,9 11.5,8 10.5,8H9.5C9,8 8.5,7.5 8.5,7Z" />
            </svg>
            Transferencias
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {activeView === "dashboard" && (
            <>
              <section className="welcome-section">
                <div className="welcome-card">
                  <h2>¡Bienvenido a tu Panel de Cliente!</h2>
                  <p>
                    Puedes gestionar tu perfil y ver tu información personal.
                  </p>
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

                  <div
                    className="action-card"
                    onClick={() => handleViewChange("accounts")}
                  >
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
                      </svg>
                    </div>
                    <h3>Cuentas Bancarias</h3>
                    <p>Gestiona tus cuentas bancarias</p>
                  </div>

                  <div
                    className="action-card"
                    onClick={() => handleViewChange("transactions")}
                  >
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,6V18H21V6H3M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
                      </svg>
                    </div>
                    <h3>Transacciones</h3>
                    <p>Consulta tu historial de transacciones</p>
                  </div>

                  <div
                    className="action-card"
                    onClick={() => handleViewChange("transfer")}
                  >
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2,10V8L3,9L4,8V10L3,11L2,10M5,8V10L6,11L7,10V8L6,7L5,8M8.5,10H10.5C11,10 11.5,9.5 11.5,9C11.5,8.5 11,8 10.5,8H9.5C9,8 8.5,7.5 8.5,7C8.5,6.5 9,6 9.5,6H11.5V4.5H9.5C8.5,4.5 7.5,5.5 7.5,6.5V7C7.5,8 8.5,9 9.5,9H10.5C11,9 11.5,9.5 11.5,10C11.5,10.5 11,11 10.5,11H8.5V12.5H10.5C11.5,12.5 12.5,11.5 12.5,10.5V10C12.5,9 11.5,8 10.5,8H9.5C9,8 8.5,7.5 8.5,7Z" />
                      </svg>
                    </div>
                    <h3>Transferencias</h3>
                    <p>Realiza transferencias entre cuentas</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeView === "accounts" && (
            <section className="accounts-section">
              <AccountsManager />
            </section>
          )}

          {activeView === "transactions" && (
            <section className="transactions-section">
              <MovementHistory userRole="CLIENT" />
            </section>
          )}

          {activeView === "transfer" && (
            <section className="transfer-section">
              <TransferForm
                onSuccess={() => {
                  setToast({
                    type: "success",
                    message: "Transferencia completada exitosamente",
                  });
                  handleViewChange("transactions");
                }}
                onCancel={() => handleViewChange("dashboard")}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
