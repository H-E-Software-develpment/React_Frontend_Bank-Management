import React, { useState, useEffect } from "react";
import {
  getAccountsForClient,
  addFavoriteAccount,
  removeFavoriteAccount,
} from "../../services/account/accountService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./AccountsManager.css";

const AccountsManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showFavoriteForm, setShowFavoriteForm] = useState(false);
  const [favoriteAlias, setFavoriteAlias] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAccountsForClient();
      setAccounts(response.account || []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (accountNumber) => {
    if (!favoriteAlias.trim()) {
      setToast({
        type: "error",
        message: "Por favor ingrese un alias para la cuenta favorita",
      });
      return;
    }

    try {
      await addFavoriteAccount({
        number: accountNumber,
        alias: favoriteAlias,
      });
      setToast({
        type: "success",
        message: "Cuenta agregada a favoritos exitosamente",
      });
      setShowFavoriteForm(false);
      setFavoriteAlias("");
      setSelectedAccount(null);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const handleRemoveFavorite = async (accountId) => {
    try {
      await removeFavoriteAccount(accountId);
      setToast({
        type: "success",
        message: "Cuenta removida de favoritos exitosamente",
      });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const formatAccountType = (type) => {
    return type === "CHECKING" ? "Monetaria" : "Ahorros";
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(balance);
  };

  if (loading) {
    return (
      <div className="accounts-manager">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="accounts-manager">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="accounts-header">
        <h2>Mis Cuentas Bancarias</h2>
        <p>Gestiona tus cuentas bancarias y configura tus favoritas</p>
      </div>

      {accounts.length === 0 ? (
        <div className="no-accounts">
          <div className="no-accounts-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
          </div>
          <h3>No tienes cuentas bancarias</h3>
          <p>
            Contacta con un administrador o trabajador del banco para crear tu
            primera cuenta
          </p>
        </div>
      ) : (
        <div className="accounts-grid">
          {accounts.map((account) => (
            <div key={account.aid} className="account-card">
              <div className="account-card-header">
                <div className="account-type">
                  <span className={`type-badge ${account.type.toLowerCase()}`}>
                    {formatAccountType(account.type)}
                  </span>
                </div>
                <div className="account-actions">
                  <button
                    className="favorite-btn"
                    onClick={() => {
                      setSelectedAccount(account);
                      setShowFavoriteForm(true);
                    }}
                    title="Agregar a favoritos"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="account-card-body">
                <div className="account-number">
                  <label>Número de Cuenta</label>
                  <span className="number">{account.number}</span>
                </div>

                <div className="account-balance">
                  <label>Balance Disponible</label>
                  <span className="balance">
                    {formatBalance(account.balance)}
                  </span>
                </div>

                <div className="account-info">
                  <div className="info-item">
                    <label>Estado</label>
                    <span
                      className={`status ${account.status ? "active" : "inactive"}`}
                    >
                      {account.status ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Creada</label>
                    <span>
                      {new Date(account.createdAt).toLocaleDateString("es-GT")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="account-card-footer">
                <button className="view-transactions-btn">
                  Ver Transacciones
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFavoriteForm && selectedAccount && (
        <div className="favorite-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Agregar a Favoritos</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowFavoriteForm(false);
                  setFavoriteAlias("");
                  setSelectedAccount(null);
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Cuenta: {selectedAccount.number}</p>
              <div className="form-group">
                <label htmlFor="alias">Alias para la cuenta</label>
                <input
                  type="text"
                  id="alias"
                  value={favoriteAlias}
                  onChange={(e) => setFavoriteAlias(e.target.value)}
                  placeholder="Ej: Mi cuenta principal"
                  maxLength="50"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowFavoriteForm(false);
                  setFavoriteAlias("");
                  setSelectedAccount(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleAddFavorite(selectedAccount.number)}
              >
                Agregar a Favoritos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsManager;
