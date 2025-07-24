import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  findAccounts,
  addFavoriteAccount,
  removeFavoriteAccount
} from "../../services/account/accountService";
import { showProfile } from "../../services/user/userService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./FavoriteAccounts.css";

const FavoriteAccounts = ({ onNavigateToTransfer }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [favoriteAccounts, setFavoriteAccounts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOwnerDpi, setSearchOwnerDpi] = useState("");
  const [searchAlias, setSearchAlias] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    loadFavoriteAccounts();
  }, []);

  const loadFavoriteAccounts = async () => {
    setLoading(true);
    try {
      // Get user profile which contains favorites
      const userResponse = await showProfile();
      const userFavorites = userResponse.user?.favorites || [];

      if (userFavorites.length === 0) {
        setFavoriteAccounts([]);
        return;
      }

      // Get account number mappings from localStorage (workaround for CLIENT restrictions)
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.uid;
      const localFavoritesKey = `favoriteNumbers_${userId}`;
      const accountNumberMappings = JSON.parse(localStorage.getItem(localFavoritesKey) || "{}");

      const favoriteAccountsDetails = [];

      for (const favorite of userFavorites) {
        // Try to get account number from our local mapping first
        let accountNumber = accountNumberMappings[favorite.account];

        // If we don't have it locally, try to get it from findAccounts (works for own accounts)
        if (!accountNumber) {
          try {
            const accountResponse = await findAccounts({ aid: favorite.account });
            if (accountResponse.account && accountResponse.account.length > 0) {
              accountNumber = accountResponse.account[0].number;
              // Store it locally for future use
              accountNumberMappings[favorite.account] = accountNumber;
              localStorage.setItem(localFavoritesKey, JSON.stringify(accountNumberMappings));
            }
          } catch (error) {
            // This will fail for other users' accounts due to CLIENT restrictions
            console.log("Could not get account details for:", favorite.account);
          }
        }

        // Create favorite account entry
        const favoriteAccount = {
          _id: favorite.account,
          alias: favorite.alias,
          number: accountNumber || "Cuenta No Disponible", // Fallback if we can't get the number
          accountId: favorite.account
        };

        favoriteAccountsDetails.push(favoriteAccount);
      }

      setFavoriteAccounts(favoriteAccountsDetails);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const searchAccounts = async () => {
    if (!searchOwnerDpi.trim()) {
      setToast({ type: "error", message: "Ingresa el DPI del propietario de la cuenta" });
      return;
    }

    setSearchLoading(true);
    try {
      // Search accounts by owner DPI to get around CLIENT role restrictions
      const response = await findAccounts({ owner: searchOwnerDpi.trim() });
      const accounts = response.account || [];

      if (accounts.length === 0) {
        setToast({ type: "error", message: "No se encontraron cuentas para este DPI" });
        setSearchResults([]);
        return;
      }

      // If user provided account number, filter by it
      let filteredAccounts = accounts;
      if (searchQuery.trim()) {
        filteredAccounts = accounts.filter(acc =>
          acc.number === searchQuery.trim() && acc.status !== false
        );

        if (filteredAccounts.length === 0) {
          setToast({ type: "error", message: "No se encontró una cuenta con ese número para este DPI" });
          setSearchResults([]);
          return;
        }
      }

      // Filter out accounts that are already favorites
      const favoriteNumbers = favoriteAccounts.map(acc => acc.number);
      const availableAccounts = filteredAccounts.filter(acc =>
        !favoriteNumbers.includes(acc.number)
      );

      if (availableAccounts.length === 0) {
        setToast({ type: "info", message: "Todas las cuentas encontradas ya están en tus favoritos" });
        setSearchResults([]);
        return;
      }

      // Add owner information from response
      const accountsWithOwner = availableAccounts.map(account => ({
        ...account,
        owner: response.user || account.owner
      }));

      setSearchResults(accountsWithOwner);
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddFavorite = async (account) => {
    if (!searchAlias.trim()) {
      setToast({ type: "error", message: "Ingresa un alias para la cuenta favorita" });
      return;
    }

    setSearchLoading(true);
    try {
      const response = await addFavoriteAccount({
        number: account.number,
        alias: searchAlias.trim()
      });

      // Store account number mapping locally to work around CLIENT role restrictions
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.uid;

      if (userId && response.user) {
        const localFavoritesKey = `favoriteNumbers_${userId}`;
        const existingMappings = JSON.parse(localStorage.getItem(localFavoritesKey) || "{}");

        // Find the newly added favorite to get its account ID
        const newFavorite = response.user.favorites.find(fav =>
          fav.alias === searchAlias.trim() && !existingMappings[fav.account]
        );

        if (newFavorite) {
          existingMappings[newFavorite.account] = account.number;
          localStorage.setItem(localFavoritesKey, JSON.stringify(existingMappings));
        }
      }

      setToast({ type: "success", message: "Cuenta agregada a favoritos exitosamente" });
      setShowSearchModal(false);
      setSearchQuery("");
      setSearchOwnerDpi("");
      setSearchAlias("");
      setSearchResults([]);
      loadFavoriteAccounts();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRemoveFavorite = async (accountId) => {
    const confirmRemove = window.confirm("¿Estás seguro de que deseas eliminar esta cuenta de favoritos?");
    if (!confirmRemove) return;

    setLoading(true);
    try {
      await removeFavoriteAccount(accountId);

      // Clean up localStorage mapping
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.uid;
      const localFavoritesKey = `favoriteNumbers_${userId}`;
      const accountNumberMappings = JSON.parse(localStorage.getItem(localFavoritesKey) || "{}");

      if (accountNumberMappings[accountId]) {
        delete accountNumberMappings[accountId];
        localStorage.setItem(localFavoritesKey, JSON.stringify(accountNumberMappings));
      }

      setToast({ type: "success", message: "Cuenta eliminada de favoritos" });
      loadFavoriteAccounts();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteCardClick = (accountNumber) => {
    // Use the callback prop to change view and set destination account
    if (onNavigateToTransfer) {
      onNavigateToTransfer(accountNumber);
    } else {
      // Fallback to route navigation if prop not provided
      navigate("../transfer", {
        state: { destinationAccount: accountNumber }
      });
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
    <div className="favorite-accounts">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="favorite-accounts-header">
        <h2>Cuentas Favoritas</h2>
        <button 
          className="add-favorite-btn"
          onClick={() => setShowSearchModal(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Agregar Cuenta
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : favoriteAccounts.length > 0 ? (
        <div className="favorites-grid">
          {favoriteAccounts.map((account) => (
            <div
              key={account._id || account.number}
              className="favorite-account-card clickable"
              onClick={() => handleFavoriteCardClick(account.number)}
            >
              <div className="favorite-card-header">
                <div className="account-info">
                  <h3>{account.alias}</h3>
                  <span className="account-number">{account.number}</span>
                </div>
                <button
                  className="remove-favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when removing
                    handleRemoveFavorite(account._id);
                  }}
                  title="Eliminar de favoritos"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>

              <div className="favorite-card-footer">
                <p className="transfer-hint">Haz clic para transferir a esta cuenta</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-favorites">
          <div className="no-favorites-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
            </svg>
          </div>
          <h3>No tienes cuentas favoritas</h3>
          <p>Agrega cuentas a favoritos para acceder rápidamente a ellas</p>
        </div>
      )}

      {showSearchModal && (
        <div className="search-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Buscar Cuentas de Otro Cliente</h3>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery("");
                  setSearchOwnerDpi("");
                  setSearchAlias("");
                  setSearchResults([]);
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>

            <div className="search-form">
              <p className="search-instruction">
                Para agregar cuentas de otros clientes a favoritos, necesitas conocer el DPI del propietario.
              </p>

              <div className="form-group">
                <label htmlFor="owner-dpi-search">DPI del Propietario: *</label>
                <input
                  type="text"
                  id="owner-dpi-search"
                  value={searchOwnerDpi}
                  onChange={(e) => setSearchOwnerDpi(e.target.value)}
                  placeholder="Ingresa el DPI del propietario..."
                  maxLength="13"
                  onKeyPress={(e) => e.key === 'Enter' && searchAccounts()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="account-search">Número de Cuenta (opcional):</label>
                <input
                  type="text"
                  id="account-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por número específico..."
                  onKeyPress={(e) => e.key === 'Enter' && searchAccounts()}
                />
              </div>

              <button 
                className="search-btn"
                onClick={searchAccounts}
                disabled={searchLoading}
              >
                {searchLoading ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>Resultados de búsqueda:</h4>
                {searchResults.map((account) => (
                  <div key={account.number} className="search-result-card">
                    <div className="result-info">
                      <h5>🏦 Cuenta: {account.number}</h5>
                      <p><strong>Tipo:</strong> {formatAccountType(account.type)}</p>
                      <p><strong>Balance:</strong> {formatAmount(account.balance)}</p>
                      <p><strong>Propietario:</strong> {account.owner?.name}</p>
                      <p><strong>DPI:</strong> {account.owner?.dpi}</p>
                    </div>
                    
                    <div className="add-form">
                      <div className="form-group">
                        <label htmlFor="alias-input">Alias:</label>
                        <input
                          type="text"
                          id="alias-input"
                          value={searchAlias}
                          onChange={(e) => setSearchAlias(e.target.value)}
                          placeholder="Ej: Cuenta de Juan"
                          maxLength={50}
                        />
                      </div>
                      
                      <button
                        className="add-btn"
                        onClick={() => handleAddFavorite(account)}
                        disabled={searchLoading}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteAccounts;
