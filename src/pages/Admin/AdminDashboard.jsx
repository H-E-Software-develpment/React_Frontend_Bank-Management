import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsersForAdmin, findUsers } from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [topIncomeUsers, setTopIncomeUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [filters, setFilters] = useState({
    uid: "",
    username: "",
    name: "",
    role: "",
    limit: 10,
    from: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (activeView === "users") {
      loadAllUsersExcludingAdmins();
    } else if (activeView === "overview") {
      loadTopIncomeUsers();
      loadAllUsersExcludingAdmins(); // Load users for stats
    }
  }, [activeView]);

  // Load data on component mount
  useEffect(() => {
    loadTopIncomeUsers();
    loadAllUsersExcludingAdmins();
  }, []);

  const loadAllUsersExcludingAdmins = async () => {
    setLoading(true);
    try {
      const response = await getUsersForAdmin();
      // Filter out administrators from general view
      const filteredUsers = (response.user || []).filter(
        (u) => u.role !== "ADMINISTRATOR",
      );
      setUsers(filteredUsers);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadTopIncomeUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersForAdmin();
      const sortedUsers = (response.user || [])
        .filter((u) => u.income)
        .sort((a, b) => b.income - a.income)
        .slice(0, 5);
      setTopIncomeUsers(sortedUsers);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (filterData = {}) => {
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
      if (searchData.role && searchData.role.trim())
        cleanFilters.role = searchData.role.trim();

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
    searchUsers();
  };

  const clearFilters = () => {
    setFilters({
      uid: "",
      username: "",
      name: "",
      role: "",
      limit: 10,
      from: 0,
    });
    if (activeView === "users") {
      loadAllUsersExcludingAdmins();
    }
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

  const goToCreateUser = () => {
    navigate("/createuser");
  };

  const getUserStats = () => {
    const stats = {
      total: users.length,
      clients: users.filter((u) => u.role === "CLIENT").length,
      workers: users.filter((u) => u.role === "WORKER").length,
      admins: users.filter((u) => u.role === "ADMINISTRATOR").length,
      averageIncome:
        users.length > 0
          ? Math.round(
              users.reduce((sum, u) => sum + (u.income || 0), 0) / users.length,
            )
          : 0,
    };
    return stats;
  };

  const canEditUser = (targetUser) => {
    // Administrators cannot edit other administrators
    return targetUser.role !== "ADMINISTRATOR";
  };

  const stats = getUserStats();

  return (
    <div className="admin-dashboard">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Administrador</h1>
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

      <nav className="dashboard-nav">
        <div className="nav-content">
          <button
            className={`nav-btn ${activeView === "overview" ? "active" : ""}`}
            onClick={() => setActiveView("overview")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M13,9H18V7H13V9M13,13H18V11H13V13M13,17H18V15H13V17M11,15H6V13H11V15M11,11H6V9H11V11M11,7H6V5H11V7Z" />
            </svg>
            Resumen
          </button>
          <button
            className={`nav-btn ${activeView === "users" ? "active" : ""}`}
            onClick={() => setActiveView("users")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,4C18.2,4 20,5.8 20,8C20,10.2 18.2,12 16,12C13.8,12 12,10.2 12,8C12,5.8 13.8,4 16,4M16,14C20.4,14 24,15.8 24,18V20H8V18C8,15.8 11.6,14 16,14M12.5,11.5C15.1,11.5 17.5,12.8 17.5,15V16.5H6.5V15C6.5,12.8 8.9,11.5 12.5,11.5M8.5,4C10.7,4 12.5,5.8 12.5,8C12.5,10.2 10.7,12 8.5,12C6.3,12 4.5,10.2 4.5,8C4.5,5.8 6.3,4 8.5,4Z" />
            </svg>
            Gestionar Usuarios
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {activeView === "overview" && (
            <>
              <section className="stats-section">
                <h2>Estadísticas del Sistema</h2>
                <div className="stats-grid">
                  <div className="stat-card total">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <h3>Total de Usuarios</h3>
                      <span className="stat-value">{stats.total}</span>
                    </div>
                  </div>

                  <div className="stat-card clients">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <h3>Clientes</h3>
                      <span className="stat-value">{stats.clients}</span>
                    </div>
                  </div>

                  <div className="stat-card workers">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20,17A2,2 0 0,0 22,15V4A2,2 0 0,0 20,2H9.46C9.81,2.61 10,3.3 10,4H20V15H11V17M15,7V9H9V22H7V16H5V22H3V14H1.5V9A2,2 0 0,1 3.5,7H15M8,4A2,2 0 0,1 6,2A2,2 0 0,1 4,4A2,2 0 0,1 6,6A2,2 0 0,1 8,4Z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <h3>Trabajadores</h3>
                      <span className="stat-value">{stats.workers}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="top-income-section">
                <h2>Usuarios con Mayores Ingresos</h2>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="top-income-list">
                    {topIncomeUsers.length > 0 ? (
                      topIncomeUsers.map((user, index) => (
                        <div key={user.uid} className="income-card">
                          <div className="income-rank">#{index + 1}</div>
                          <div className="income-user-info">
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                            <span className="user-role-badge">{user.role}</span>
                          </div>
                          <div className="income-amount">
                            Q{user.income?.toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-data">
                        <p>No hay datos de ingresos disponibles</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          )}

          {activeView === "users" && (
            <section className="users-management-section">
              <div className="section-header">
                <h2>Gestión de Usuarios</h2>
                <button
                  className="create-user-action-btn"
                  onClick={goToCreateUser}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  Crear Usuario
                </button>
              </div>

              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-grid">
                  <div className="search-group">
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
                  <div className="search-group">
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
                  <div className="search-group">
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
                  <div className="search-group">
                    <label htmlFor="role">Rol:</label>
                    <select
                      id="role"
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todos los roles</option>
                      <option value="CLIENT">Cliente</option>
                      <option value="WORKER">Trabajador</option>
                      <option value="ADMINISTRATOR">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="search-actions">
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

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="users-grid">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user.uid}
                        className={`user-management-card ${canEditUser(user) ? "clickable" : ""}`}
                        onClick={() =>
                          canEditUser(user) &&
                          navigate(`/edituser?uid=${user.uid}`)
                        }
                        style={canEditUser(user) ? { cursor: "pointer" } : {}}
                      >
                        <div className="user-card-header">
                          <h3>{user.name}</h3>
                          <span
                            className={`user-role ${user.role.toLowerCase()}`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className="user-card-body">
                          <p>
                            <strong>Usuario:</strong> {user.username}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p>
                            <strong>Teléfono:</strong> {user.phone}
                          </p>
                          <p>
                            <strong>Trabajo:</strong> {user.job}
                          </p>
                          <p>
                            <strong>Ingresos:</strong> Q
                            {user.income?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-users">
                      <p>No se encontraron usuarios</p>
                      <button
                        className="load-all-btn"
                        onClick={loadAllUsersExcludingAdmins}
                      >
                        Cargar Todos los Usuarios
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
