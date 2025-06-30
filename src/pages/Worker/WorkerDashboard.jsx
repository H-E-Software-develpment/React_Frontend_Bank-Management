import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { findUsers } from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
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

  const goToEditUser = () => {
    navigate("/edituser");
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
              <button
                className="icon-button edit-user-btn"
                onClick={goToEditUser}
                title="Editar clientes"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5,7A6.5,6.5 0 0,1 20,13.5A6.5,6.5 0 0,1 13.5,20H10V18H13.5C16,18 18,16 18,13.5C18,11 16,9 13.5,9H7.83L10.91,5.91L9.5,4.5L4,10L9.5,15.5L10.91,14.09L7.83,11H13.5M6,7V9H4V7H6Z" />
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
                    <div key={client.uid} className="user-card">
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
    </div>
  );
};

export default WorkerDashboard;
