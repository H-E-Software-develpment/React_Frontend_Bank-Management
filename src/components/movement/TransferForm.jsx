import React, { useState, useEffect } from "react";
import { createTransfer } from "../../services/movement/movementService";
import { getAccountsForClient } from "../../services/account/accountService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./MovementForms.css";

const TransferForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [userAccounts, setUserAccounts] = useState([]);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    loadUserAccounts();
  }, []);

  const loadUserAccounts = async () => {
    try {
      const response = await getAccountsForClient();
      setUserAccounts(response.account || []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.amount) <= 0) {
      setToast({
        type: "error",
        message: "El monto debe ser mayor a 0",
      });
      return;
    }

    if (formData.origin === formData.destination) {
      setToast({
        type: "error",
        message: "La cuenta de origen y destino no pueden ser la misma",
      });
      return;
    }

    setLoading(true);
    try {
      const transferData = {
        origin: formData.origin,
        destination: formData.destination,
        amount: parseFloat(formData.amount),
        description: formData.description || "Transferencia",
      };

      await createTransfer(transferData);
      setToast({
        type: "success",
        message: "Transferencia realizada exitosamente",
      });

      setTimeout(() => {
        onSuccess && onSuccess();
      }, 2000);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movement-form">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="form-header">
        <h2>Realizar Transferencia</h2>
        <p>Transfiere dinero entre cuentas bancarias</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="origin">Cuenta de Origen *</label>
          <select
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona tu cuenta</option>
            {userAccounts.map((account) => (
              <option key={account.aid} value={account.number}>
                {account.number} - Q{account.balance.toLocaleString()} (
                {account.type === "CHECKING" ? "Monetaria" : "Ahorros"})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="destination">Cuenta de Destino *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            placeholder="Número de cuenta destino"
            maxLength="20"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Monto (Q) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
            min="0.01"
            step="0.01"
            placeholder="Monto a transferir"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            placeholder="Descripción opcional de la transferencia"
            maxLength="200"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Procesando transferencia...
              </>
            ) : (
              <>
                <svg
                  className="btn-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.95 21.175L13.1 18.3L14.5 16.9L15.95 18.35L19.425 14.875L20.825 16.275L15.95 21.175ZM8.5 18Q6.425 18 5.212 16.787Q4 15.575 4 13.5Q4 11.425 5.212 10.212Q6.425 9 8.5 9H16L14.2 7.2L15.6 5.8L20 10.2L15.6 14.6L14.2 13.2L16 11.4H8.5Q7.275 11.4 6.437 12.237Q5.6 13.075 5.6 14.3Q5.6 15.525 6.437 16.362Q7.275 17.2 8.5 17.2H10V18.8H8.5Z" />
                </svg>
                Realizar Transferencia
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
