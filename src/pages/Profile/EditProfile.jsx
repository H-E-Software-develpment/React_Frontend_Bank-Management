import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  findUsers,
  editUser,
  deleteUser,
} from "../../services/user/userService";
import { logout } from "../../services/auth/authService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Toast from "../../components/common/Toast";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    uid: "",
    username: "",
    name: "",
    role: "",
    limit: 10,
    from: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    job: "",
    income: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Load user if ID is in URL params
    const userId = searchParams.get("uid");
    if (userId) {
      searchSpecificUser(userId);
    }
  }, [searchParams]);

  const searchSpecificUser = async (uid) => {
    setLoading(true);
    try {
      const response = await findUsers({ uid: uid.trim() });
      if (response.user && response.user.length > 0) {
        setUsers(response.user);
        selectUser(response.user[0]);
      } else {
        setToast({ type: "error", message: "Usuario no encontrado" });
      }
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    setLoading(true);
    try {
      // Clean the filters - remove empty values
      const cleanFilters = {};

      if (searchQuery.uid && searchQuery.uid.trim())
        cleanFilters.uid = searchQuery.uid.trim();
      if (searchQuery.username && searchQuery.username.trim())
        cleanFilters.username = searchQuery.username.trim();
      if (searchQuery.name && searchQuery.name.trim())
        cleanFilters.name = searchQuery.name.trim();
      if (searchQuery.role && searchQuery.role.trim())
        cleanFilters.role = searchQuery.role.trim();

      const response = await findUsers(cleanFilters);
      setUsers(response.user || []);
      setSelectedUser(null);
      setEditMode(false);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      address: user.address || "",
      job: user.job || "",
      income: user.income || "",
    });
    setEditMode(false);
  };

  const canEditUser = (user) => {
    if (currentUser.role === "WORKER") {
      return user.role === "CLIENT";
    }
    if (currentUser.role === "ADMINISTRATOR") {
      // Can edit WORKERS and CLIENTS, but not other ADMINISTRATORS
      return user.role === "WORKER" || user.role === "CLIENT";
    }
    return false;
  };

  const canDeleteUser = (user) => {
    if (currentUser.role === "WORKER") {
      return user.role === "CLIENT";
    }
    if (currentUser.role === "ADMINISTRATOR") {
      // Can delete WORKERS and CLIENTS, but not other ADMINISTRATORS
      return user.role === "WORKER" || user.role === "CLIENT";
    }
    return false;
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchUsers();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    try {
      const userId = selectedUser.uid || selectedUser._id;

      // Preparamos solo los campos que hayan sido modificados y sean válidos
      const editData = {};
      if (formData.name.trim() && formData.name.trim() !== selectedUser.name) {
        editData.name = formData.name.trim();
      }
      if (
        formData.address.trim() &&
        formData.address.trim() !== selectedUser.address
      ) {
        editData.address = formData.address.trim();
      }
      if (formData.job.trim() && formData.job.trim() !== selectedUser.job) {
        editData.job = formData.job.trim();
      }
      if (
        Number(formData.income) >= 100 &&
        Number(formData.income) !== selectedUser.income
      ) {
        editData.income = Number(formData.income);
      }

      // Si no cambió nada
      if (Object.keys(editData).length === 0) {
        setToast({ type: "info", message: "No realizaste ningún cambio." });
        setLoading(false);
        return;
      }

      const response = await editUser(userId, editData);

      const updatedUser = { ...selectedUser, ...response.user };
      setSelectedUser(updatedUser);
      setUsers(
        users.map((u) => ((u.uid || u._id) === userId ? updatedUser : u)),
      );
      setEditMode(false);
      setToast({
        type: "success",
        message: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      let backendMsg = error?.response?.data?.message;
      if (!backendMsg && error?.response?.data) {
        backendMsg = JSON.stringify(error.response.data);
      }
      setToast({
        type: "error",
        message: backendMsg || error.message || "Error al editar usuario",
      });
      console.error("Error completo:", error, error?.response?.data);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${selectedUser.name}? Esta acción no se puede deshacer.`,
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      const userId = selectedUser.uid || selectedUser._id;
      await deleteUser(userId);
      setUsers(users.filter((u) => (u.uid || u._id) !== userId));
      setSelectedUser(null);
      setEditMode(false);
      setToast({ type: "success", message: "Usuario eliminado exitosamente" });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    const userRole = currentUser?.role;
    if (userRole === "ADMINISTRATOR") navigate("/admin");
    else if (userRole === "WORKER") navigate("/worker");
    else navigate("/client");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const clearSearch = () => {
    setSearchQuery({
      uid: "",
      username: "",
      name: "",
      role: "",
      limit: 10,
      from: 0,
    });
    setUsers([]);
    setSelectedUser(null);
    setEditMode(false);
  };

  return (
    <div className="edit-profile">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <header className="edit-header">
        <div className="header-content">
          <button className="back-btn" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.59L5.83,13H19V17H21V7H19Z" />
            </svg>
            Volver
          </button>
          <h1>Gestionar Usuarios</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="edit-main">
        <div className="edit-container">
          {!selectedUser && (
            <section className="no-user-section">
              <div className="no-user-message">
                <h2>Usuario no seleccionado</h2>
                <p>
                  Acceda a esta página seleccionando un usuario específico desde
                  el panel de administración.
                </p>
              </div>
            </section>
          )}

          {selectedUser && (
            <section className="user-details-section">
              <div className="details-header">
                <h2>Detalles del Usuario</h2>
                <div className="details-actions">
                  {canEditUser(selectedUser) && (
                    <button
                      className="edit-user-btn"
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? "Cancelar" : "Editar"}
                    </button>
                  )}
                  {canDeleteUser(selectedUser) && (
                    <button
                      className="delete-user-btn"
                      onClick={handleDeleteUser}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>

              {!editMode ? (
                <div className="user-details">
                  <div className="details-card">
                    <div className="detail-item">
                      <label>Nombre:</label>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Usuario:</label>
                      <span>{selectedUser.username}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>DPI:</label>
                      <span>{selectedUser.dpi}</span>
                    </div>
                    <div className="detail-item">
                      <label>Teléfono:</label>
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Dirección:</label>
                      <span>{selectedUser.address}</span>
                    </div>
                    <div className="detail-item">
                      <label>Trabajo:</label>
                      <span>{selectedUser.job}</span>
                    </div>
                    <div className="detail-item">
                      <label>Ingresos:</label>
                      <span>Q{selectedUser.income?.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Rol:</label>
                      <span
                        className={`role-badge ${selectedUser.role.toLowerCase()}`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="edit-form" onSubmit={handleEditSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="edit-name">Nombre:</label>
                      <input
                        type="text"
                        id="edit-name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-address">Dirección:</label>
                      <textarea
                        id="edit-address"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        required
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-job">Trabajo:</label>
                      <input
                        type="text"
                        id="edit-job"
                        name="job"
                        value={formData.job}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-income">Ingresos (Q):</label>
                      <input
                        type="number"
                        id="edit-income"
                        name="income"
                        value={formData.income}
                        onChange={handleFormChange}
                        min="100"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="save-changes-btn"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </form>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
