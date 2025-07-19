import React, { useState } from "react";
import { getAccountsByMovements } from "../../services/movement/movementService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./MovementForms.css";

const AccountsByMovements = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [order, setOrder] = useState("MORE");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await getAccountsByMovements({ order });
      setAccounts(response.accounts || []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  const formatAccountType = (type) => {
    return type === "CHECKING" ? "Monetaria" : "Ahorros";
  };

  return (
    <div className="accounts-by-movements">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="section-header">
        <h2>Cuentas por Actividad de Movimientos</h2>
        <p>Consulta las cuentas ordenadas por cantidad de movimientos</p>
      </div>

      <form className="filters-form" onSubmit={handleSearch}>
        <div className="filter-group">
          <label htmlFor="order">Ordenar por</label>
          <select
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="MORE">Más movimientos</option>
            <option value="LESS">Menos movimientos</option>
          </select>
        </div>

        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </button>
      </form>

      {accounts.length > 0 && (
        <div className="accounts-results">
          <div className="results-header">
            <p>Se encontraron {accounts.length} cuentas</p>
          </div>

          <div className="accounts-grid">
            {accounts.map((account, index) => (
              <div key={account.number} className="account-movement-card">
                <div className="card-header">
                  <div className="rank-badge">#{index + 1}</div>
                  <div className="account-info">
                    <h3>{account.number}</h3>
                    <span className="account-type">
                      {formatAccountType(account.type)}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="balance-info">
                    <label>Balance</label>
                    <span className="balance">
                      {formatAmount(account.balance)}
                    </span>
                  </div>

                  <div className="movements-info">
                    <label>Total de Movimientos</label>
                    <span className="movements-count">{account.movements}</span>
                  </div>

                  <div className="owner-info">
                    <label>Propietario</label>
                    <div className="owner-details">
                      <p className="owner-name">{account.owner.name}</p>
                      <p className="owner-username">
                        @{account.owner.username}
                      </p>
                      <p className="owner-dpi">DPI: {account.owner.dpi}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {accounts.length === 0 && !loading && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
          </div>
          <h3>No hay resultados</h3>
          <p>Haz clic en "Buscar" para ver las cuentas por actividad</p>
        </div>
      )}
    </div>
  );
};

export default AccountsByMovements;
