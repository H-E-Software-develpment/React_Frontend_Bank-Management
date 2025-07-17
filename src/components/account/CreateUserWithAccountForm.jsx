import React, { useState } from "react";
import { createClientWithAccount } from "../../services/account/accountService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./AccountForms.css";

const CreateUserWithAccountForm = ({ userRole, onSuccess }) => {
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
    job: "",
    income: "",
    type: "CHECKING",
    balance: "0",
  });

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

    if (parseInt(formData.balance) < 0) {
      setToast({
        type: "error",
        message: "El balance inicial no puede ser negativo",
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
        job: formData.job,
        income: parseInt(formData.income),
        type: formData.type,
        balance: parseInt(formData.balance),
      };

      await createClientWithAccount(userData);
      setToast({
        type: "success",
        message: "Cliente y cuenta creados exitosamente",
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-form">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="form-header">
        <h2>Crear Cliente con Cuenta Bancaria</h2>
        <p>Complete la información del cliente y su primera cuenta bancaria</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Información del Cliente</h3>

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
              placeholder="Nombre completo del cliente"
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
              placeholder="cliente@ejemplo.com"
            />
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
              placeholder="Dirección completa del cliente"
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

        <div className="form-section">
          <h3>Información de la Cuenta Bancaria</h3>

          <div className="form-group">
            <label htmlFor="type">Tipo de Cuenta *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="CHECKING">Corriente</option>
              <option value="SAVINGS">Ahorros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="balance">Balance Inicial (Q) *</label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={formData.balance}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="Balance inicial de la cuenta"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                Creando Cliente...
              </>
            ) : (
              "Crear Cliente con Cuenta"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserWithAccountForm;
