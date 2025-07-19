import React, { useState } from "react";
import { createAccount } from "../../services/account/accountService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./AccountForms.css";

const CreateAccountForm = ({ userRole, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    owner: "",
    type: "CHECKING",
    balance: "0",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.owner.length !== 13) {
      setToast({
        type: "error",
        message: "El DPI debe tener exactamente 13 caracteres",
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
      const accountData = {
        owner: formData.owner,
        type: formData.type,
        balance: parseInt(formData.balance),
      };

      await createAccount(accountData);
      setToast({
        type: "success",
        message: "Cuenta bancaria creada exitosamente",
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
    <div className="create-account-form">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="form-header">
        <h2>Crear Cuenta Bancaria</h2>
        <p>Crear una nueva cuenta para un cliente existente</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="owner">DPI del Cliente *</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleInputChange}
            required
            maxLength="13"
            pattern="[0-9]{13}"
            placeholder="1234567890123 (13 dígitos)"
          />
          <small className="form-help">
            Ingrese el DPI del cliente para quien desea crear la cuenta
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo de Cuenta *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="CHECKING">Monetaria</option>
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

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                Creando Cuenta...
              </>
            ) : (
              "Crear Cuenta Bancaria"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountForm;
