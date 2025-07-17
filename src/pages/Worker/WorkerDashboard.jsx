import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { findUsers } from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import CreateUserOptions from "../../components/account/CreateUserOptions";
import "./WorkerDashboard.css";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    uid: "",
    username: "",
    name: "",
    limit: 10,
    from: 0,
  });
  const [showCreateOptions, setShowCreateOptions] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (filterData = {}) => {
    setLoading(true);
    try {
      // Clean the filters - remove empty values
      const cleanFilters = {};
      const searchData = { ...filters, ...filterData };

      if (searchData.uid && searchData.uid.trim())
        cleanFilters.uid = searchData.uid.trim();
      if (searchData.username && searchData.username.trim())
        cleanFilters.username = searchData.username.trim();
      if (searchData.name && searchData.name.trim())
        cleanFilters.name = searchData.name.trim();

      const response = await findUsers(cleanFilters);
      setUsers(response.user || []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToEditUser = (uid) => {
    navigate(`/edituser?uid=${uid}`);
  };

  const clearFilters = () => {
    setFilters({
      uid: "",
      username: "",
      name: "",
      limit: 10,
      from: 0,
    });
    // Load users with empty filters to get all clients
    loadUsers({});
  };

  const handleShowCreateOptions = () => {
    setShowCreateOptions(true);
  };

  const handleCloseCreateOptions = () => {
    setShowCreateOptions(false);
    // Refresh the users list after creating
    loadUsers();
  };

  return (
    <div className="worker-dashboard">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Trabajador</h1>
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

      <main className="dashboard-main">
        <div className="dashboard-content">
          <section className="create-section">
            <h2>Crear Clientes</h2>
            <div className="create-options-grid">
              <div
                className="create-option-card"
                onClick={handleShowCreateOptions}
              >
                <div className="option-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
                  </svg>
                </div>
                <h3>Crear Cliente</h3>
                <p>Cliente sin cuenta bancaria</p>
              </div>

              <div
                className="create-option-card"
                onClick={handleShowCreateOptions}
              >
                <div className="option-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.71,4.29C19.19,5.79 20,7.79 20,10C20,12.21 19.19,14.21 17.71,15.71C16.21,17.19 14.21,18 12,18C9.79,18 7.79,17.19 6.29,15.71C4.81,14.21 4,12.21 4,10C4,7.79 4.81,5.79 6.29,4.29C7.79,2.81 9.79,2 12,2Z" />
                  </svg>
                </div>
                <h3>Cliente con Cuenta</h3>
                <p>Cliente con cuenta bancaria</p>
              </div>

              <div
                className="create-option-card"
                onClick={handleShowCreateOptions}
              >
                <div className="option-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                  </svg>
                </div>
                <h3>Crear Cuenta</h3>
                <p>Cuenta para cliente existente</p>
              </div>
            </div>
          </section>

          <section className="filters-section">
            <h2>Buscar Clientes</h2>
            <form className="filters-form" onSubmit={handleSearch}>
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="uid">ID Usuario:</label>
                  <input
                    type="text"
                    id="uid"
                    name="uid"
                    value={filters.uid}
                    onChange={handleFilterChange}
                    placeholder="Buscar por ID..."
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="username">Nombre de Usuario:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    placeholder="Buscar por usuario..."
                  />
                </div>
              </div>
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="name">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Buscar por nombre..."
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="limit">Límite:</label>
                  <select
                    id="limit"
                    name="limit"
                    value={filters.limit}
                    onChange={handleFilterChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
              <div className="filter-actions">
                <button type="submit" className="search-btn">
                  Buscar
                </button>
                <button
                  type="button"
                  className="clear-btn"
                  onClick={clearFilters}
                >
                  Limpiar
                </button>
              </div>
            </form>
          </section>

          <section className="users-section">
            <h2>Lista de Clientes</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="users-grid">
                {users.length > 0 ? (
                  users.map((client) => (
                    <div
                      key={client.uid}
                      className="user-card clickable-card"
                      onClick={() => goToEditUser(client.uid)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="user-card-header">
                        <h3>{client.name}</h3>
                        <span className="user-role">{client.role}</span>
                      </div>
                      <div className="user-card-body">
                        <p>
                          <strong>Usuario:</strong> {client.username}
                        </p>
                        <p>
                          <strong>Email:</strong> {client.email}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {client.phone}
                        </p>
                        <p>
                          <strong>Trabajo:</strong> {client.job}
                        </p>
                        <p>
                          <strong>Ingresos:</strong> Q
                          {client.income?.toLocaleString()}
                        </p>
                      </div>
                      <div className="user-card-footer">
                        <span className="user-id">ID: {client.uid}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-users">
                    <p>No se encontraron clientes</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {showCreateOptions && (
        <CreateUserOptions
          userRole="WORKER"
          onClose={handleCloseCreateOptions}
        />
      )}
    </div>
  );
};

export default WorkerDashboard;
