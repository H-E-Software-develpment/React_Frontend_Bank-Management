import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  showProfile,
  editUserProfile,
  changeUserPassword,
} from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    job: "",
    income: "",
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmation: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await showProfile();
      setProfile(response.user);
      setFormData({
        name: response.user.name || "",
        address: response.user.address || "",
        job: response.user.job || "",
        income: response.user.income || "",
      });
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

  const goBack = () => {
    const userRole = user?.role;
    if (userRole === "ADMINISTRATOR") navigate("/admin");
    else if (userRole === "WORKER") navigate("/worker");
    else navigate("/client");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await editUserProfile(formData);
      setProfile(response.user);
      setEditMode(false);
      setToast({ type: "success", message: "Perfil actualizado exitosamente" });

      // Update localStorage user data
      const updatedUser = { ...user, ...response.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      minLength && hasLowercase && hasUppercase && hasNumbers && hasSymbols
    );
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(passwordData.password)) {
      setToast({
        type: "error",
        message:
          "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos",
      });
      return;
    }

    if (passwordData.password !== passwordData.confirmation) {
      setToast({ type: "error", message: "Las contraseñas no coinciden" });
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword(passwordData);
      setPasswordData({ password: "", confirmation: "" });
      setToast({
        type: "success",
        message: "Contraseña cambiada exitosamente",
      });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="user-profile">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="user-profile">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <header className="profile-header">
        <div className="header-content">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.59L5.83,13H19V17H21V7H19Z" />
            </svg>
            Volver
          </button>
          <h1>Mi Perfil</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              Información Personal
            </button>
            <button
              className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
              Cambiar Contraseña
            </button>
          </div>

          <div className="profile-content">
            {activeTab === "profile" && (
              <div className="profile-info-section">
                {!editMode ? (
                  <div className="profile-view">
                    <div className="profile-card">
                      <div className="profile-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                        </svg>
                      </div>

                      <div className="profile-details">
                        <h2>{profile?.name}</h2>
                        <span className="user-role">{profile?.role}</span>
                      </div>

                      <div className="info-grid">
                        <div className="info-item">
                          <label>Email:</label>
                          <span>{profile?.email}</span>
                        </div>
                        <div className="info-item">
                          <label>Usuario:</label>
                          <span>{profile?.username}</span>
                        </div>
                        <div className="info-item">
                          <label>DPI:</label>
                          <span>{profile?.dpi}</span>
                        </div>
                        <div className="info-item">
                          <label>Teléfono:</label>
                          <span>{profile?.phone}</span>
                        </div>
                        <div className="info-item">
                          <label>Dirección:</label>
                          <span>{profile?.address}</span>
                        </div>
                        <div className="info-item">
                          <label>Trabajo:</label>
                          <span>{profile?.job}</span>
                        </div>
                        <div className="info-item income-item">
                          <label>Ingresos Mensuales:</label>
                          <span className="income-value">
                            Q{profile?.income?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        className="edit-btn"
                        onClick={() => setEditMode(true)}
                      >
                        Editar Información
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    className="profile-edit-form"
                    onSubmit={handleProfileSubmit}
                  >
                    <h2>Editar Información Personal</h2>

                    <div className="form-group">
                      <label htmlFor="name">Nombre Completo:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Dirección:</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="job">Trabajo:</label>
                      <input
                        type="text"
                        id="job"
                        name="job"
                        value={formData.job}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="income">Ingresos Mensuales (Q):</label>
                      <input
                        type="number"
                        id="income"
                        name="income"
                        value={formData.income}
                        onChange={handleInputChange}
                        min="100"
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setEditMode(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="save-btn"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div className="password-section">
                <form className="password-form" onSubmit={handlePasswordSubmit}>
                  <h2>Cambiar Contraseña</h2>

                  <div className="form-group">
                    <label htmlFor="password">Nueva Contraseña:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmation">Confirmar Contraseña:</label>
                    <input
                      type="password"
                      id="confirmation"
                      name="confirmation"
                      value={passwordData.confirmation}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <button
                    type="submit"
                    className="password-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Cambiando..." : "Cambiar Contraseña"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
