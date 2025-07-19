import React, { useState, useEffect } from "react";
import {
  findMovements,
  findMovementsForClient,
} from "../../services/movement/movementService";
import { getAccountsForClient } from "../../services/account/accountService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./MovementForms.css";

const MovementHistory = ({
  userRole,
  prefilledAccount = null,
  accountNumber = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [movements, setMovements] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    aid: prefilledAccount || "",
    type: "",
    date: "",
    worker: "",
    client: "",
    origin: "",
    destination: "",
    limit: 15,
    from: 0,
  });

  useEffect(() => {
    if (userRole === "CLIENT") {
      loadUserAccounts();
    }
  }, [userRole]);

  useEffect(() => {
    if (prefilledAccount) {
      // Auto-load movements for the prefilled account
      handleSearch({ preventDefault: () => {} });
    }
  }, [prefilledAccount]);

  const loadUserAccounts = async () => {
    try {
      const response = await getAccountsForClient();
      setUserAccounts(response.account || []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean filters - remove empty values
      const cleanFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].trim && filters[key].trim()) {
          cleanFilters[key] = filters[key].trim();
        } else if (filters[key] && !filters[key].trim) {
          cleanFilters[key] = filters[key];
        }
      });

      let response;
      if (userRole === "CLIENT") {
        // For clients, aid is required
        if (!cleanFilters.aid) {
          setToast({
            type: "error",
            message: "Debe seleccionar una cuenta para ver el historial",
          });
          setLoading(false);
          return;
        }
        response = await findMovementsForClient(cleanFilters);
      } else {
        // For workers/admins
        response = await findMovements(cleanFilters);
      }

      setMovements(response.movements || []);
      setTotal(response.total || 0);
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setMovements([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const formatMovementType = (type) => {
    const types = {
      DEPOSIT: "Depósito",
      WITHDRAWAL: "Retiro",
      TRANSFER: "Transferencia",
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-GT");
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  return (
    <div className="movement-history">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="history-header">
        <h2>Historial de Movimientos</h2>
        <p>
          {accountNumber
            ? `Transacciones de la cuenta ${accountNumber}`
            : "Consulta el historial de transacciones bancarias"}
        </p>
      </div>

      <form className="filters-form" onSubmit={handleSearch}>
        <div className="filters-grid">
          {userRole === "CLIENT" && (
            <div className="filter-group">
              <label htmlFor="aid">Cuenta *</label>
              <select
                id="aid"
                name="aid"
                value={filters.aid}
                onChange={handleFilterChange}
                required
              >
                <option value="">Selecciona una cuenta</option>
                {userAccounts.map((account) => (
                  <option key={account.aid} value={account.aid}>
                    {account.number} (
                    {account.type === "CHECKING" ? "Monetaria" : "Ahorros"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {userRole !== "CLIENT" && (
            <>
              <div className="filter-group">
                <label htmlFor="worker">DPI Trabajador</label>
                <input
                  type="text"
                  id="worker"
                  name="worker"
                  value={filters.worker}
                  onChange={handleFilterChange}
                  placeholder="DPI del trabajador"
                  maxLength="13"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="client">DPI Cliente</label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={filters.client}
                  onChange={handleFilterChange}
                  placeholder="DPI del cliente"
                  maxLength="13"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="origin">Cuenta Origen</label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={filters.origin}
                  onChange={handleFilterChange}
                  placeholder="Número de cuenta origen"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="destination">Cuenta Destino</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={filters.destination}
                  onChange={handleFilterChange}
                  placeholder="Número de cuenta destino"
                />
              </div>
            </>
          )}

          <div className="filter-group">
            <label htmlFor="type">Tipo de Movimiento</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Todos los tipos</option>
              <option value="DEPOSIT">Depósito</option>
              <option value="WITHDRAWAL">Retiro</option>
              <option value="TRANSFER">Transferencia</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date">Fecha</label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="limit">Límite</label>
            <select
              id="limit"
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
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
          <button
            type="button"
            className="clear-btn"
            onClick={() =>
              setFilters({
                aid: "",
                type: "",
                date: "",
                worker: "",
                client: "",
                origin: "",
                destination: "",
                limit: 15,
                from: 0,
              })
            }
          >
            Limpiar
          </button>
        </div>
      </form>

      {movements.length > 0 && (
        <div className="movements-results">
          <div className="results-header">
            <p>Se encontraron {total} movimientos</p>
          </div>

          <div className="movements-list">
            {movements.map((movement) => (
              <div key={movement.mid} className="movement-card">
                <div className="movement-header">
                  <span
                    className={`movement-type ${movement.type.toLowerCase()}`}
                  >
                    {formatMovementType(movement.type)}
                  </span>
                  <span className="movement-date">
                    {formatDate(movement.date)}
                  </span>
                </div>

                <div className="movement-body">
                  <div className="movement-amount">
                    {formatAmount(movement.amount)}
                  </div>

                  <div className="movement-details">
                    {movement.origin && (
                      <div className="detail-item">
                        <strong>Origen:</strong> {movement.origin.number}
                        {movement.origin.owner && (
                          <span> - {movement.origin.owner.name}</span>
                        )}
                      </div>
                    )}

                    {movement.destination && (
                      <div className="detail-item">
                        <strong>Destino:</strong> {movement.destination.number}
                        {movement.destination.owner && (
                          <span> - {movement.destination.owner.name}</span>
                        )}
                      </div>
                    )}

                    {movement.comment && (
                      <div className="detail-item">
                        <strong>Descripción:</strong> {movement.comment}
                      </div>
                    )}

                    {movement.creator && userRole !== "CLIENT" && (
                      <div className="detail-item">
                        <strong>Creado por:</strong> {movement.creator.username}{" "}
                        ({movement.creator.role})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementHistory;
