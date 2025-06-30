import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserForAdmin } from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import "./CreateUser.css";

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    dpi: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT",
    job: "",
    income: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setToast({ type: "error", message: "Las contraseñas no coinciden" });
      return;
    }

    if (formData.dpi.length !== 13) {
      setToast({
        type: "error",
        message: "El DPI debe tener exactamente 13 caracteres",
      });
      return;
    }

    if (formData.phone.length !== 8) {
      setToast({
        type: "error",
        message: "El teléfono debe tener exactamente 8 dígitos",
      });
      return;
    }

    if (parseInt(formData.income) < 100) {
      setToast({
        type: "error",
        message: "Los ingresos deben ser al menos Q100",
      });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        dpi: formData.dpi,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        job: formData.job,
        income: parseInt(formData.income),
      };

      await createUserForAdmin(userData);
      setToast({ type: "success", message: "Usuario creado exitosamente" });

      // Reset form
      setFormData({
        name: "",
        username: "",
        dpi: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "CLIENT",
        job: "",
        income: "",
      });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/admin");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="create-user">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <header className="create-header">
        <div className="header-content">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.59L5.83,13H19V17H21V7H19Z" />
            </svg>
            Volver al Admin
          </button>
          <h1>Crear Nuevo Usuario</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="create-main">
        <div className="create-container">
          <form className="create-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Información del Nuevo Usuario</h2>
              <p>Complete todos los campos para crear una nueva cuenta</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength="60"
                  placeholder="Nombre completo del usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Usuario único para el login"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dpi">DPI *</label>
                <input
                  type="text"
                  id="dpi"
                  name="dpi"
                  value={formData.dpi}
                  onChange={handleInputChange}
                  required
                  maxLength="13"
                  pattern="[0-9]{13}"
                  placeholder="1234567890123 (13 dígitos)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength="8"
                  pattern="[0-9]{8}"
                  placeholder="12345678 (8 dígitos)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Rol *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="ADMINISTRATOR">Administrador</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Dirección *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Dirección completa del usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="job">Trabajo *</label>
                <input
                  type="text"
                  id="job"
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  required
                  placeholder="Profesión u ocupación"
                />
              </div>

              <div className="form-group">
                <label htmlFor="income">Ingresos Mensuales (Q) *</label>
                <input
                  type="number"
                  id="income"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  required
                  min="100"
                  placeholder="Mínimo Q100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  placeholder="Repetir contraseña"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={goBack}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Creando Usuario...
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
