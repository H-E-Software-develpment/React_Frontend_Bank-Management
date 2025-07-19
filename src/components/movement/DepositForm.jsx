import React, { useState } from "react";
import { createDeposit } from "../../services/movement/movementService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./MovementForms.css";

const DepositForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    destination: "",
    amount: "",
    description: "",
  });

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

    setLoading(true);
    try {
      const depositData = {
        destination: formData.destination,
        amount: parseFloat(formData.amount),
        description: formData.description || "Depósito",
      };

      await createDeposit(depositData);
      setToast({
        type: "success",
        message: "Depósito realizado exitosamente",
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
        <h2>Realizar Depósito</h2>
        <p>Depositar dinero a una cuenta bancaria</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="destination">Número de Cuenta *</label>
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
            placeholder="Monto a depositar"
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
            placeholder="Descripción opcional del depósito"
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
                <LoadingSpinner />
                Procesando...
              </>
            ) : (
              "Realizar Depósito"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm;
