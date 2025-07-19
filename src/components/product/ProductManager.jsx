import React, { useState, useEffect } from "react";
import {
  findProducts,
  deleteProduct,
} from "../../services/product/productService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import CreateProductForm from "./CreateProductForm";
import "./ProductManager.css";

const ProductManager = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    limit: 15,
    from: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (filterData = {}) => {
    setLoading(true);
    try {
      const cleanFilters = {};
      const searchData = { ...filters, ...filterData };

      if (searchData.name && searchData.name.trim()) {
        cleanFilters.name = searchData.name.trim();
      }
      if (searchData.category && searchData.category.trim()) {
        cleanFilters.category = searchData.category.trim();
      }
      if (searchData.limit) {
        cleanFilters.limit = searchData.limit;
      }
      if (searchData.from) {
        cleanFilters.from = searchData.from;
      }

      const response = await findProducts(cleanFilters);
      setProducts(response.product || []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setProducts([]);
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
    loadProducts();
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: "",
      limit: 15,
      from: 0,
    });
    loadProducts({});
  };

  const handleDeleteProduct = async (pid) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      return;
    }

    try {
      await deleteProduct(pid);
      setToast({ type: "success", message: "Producto eliminado exitosamente" });
      loadProducts();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setEditingProduct(null);
    loadProducts();
    setToast({
      type: "success",
      message: editingProduct
        ? "Producto actualizado exitosamente"
        : "Producto creado exitosamente",
    });
  };

  const handleCardClick = (product, e) => {
    // Prevent card expansion when clicking action buttons
    if (e.target.closest(".product-actions")) return;
    setExpandedProduct(product);
  };

  const handleCloseExpanded = () => {
    setExpandedProduct(null);
  };

  const formatCategory = (category) => {
    const categories = {
      FOOD: "Comida",
      BEAUTY: "Belleza",
      ENTERTAINMENT: "Entretenimiento",
      OTHER: "Otros",
    };
    return categories[category] || category;
  };

  return (
    <div className="product-manager">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="manager-header">
        <h2>Gestión de Productos</h2>
        <p>Administra los productos y servicios del sistema</p>
      </div>

      {userRole === "ADMINISTRATOR" && (
        <div className="manager-actions">
          <button
            className="create-btn"
            onClick={() => {
              setEditingProduct(null);
              setShowCreateForm(true);
            }}
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Crear Producto
          </button>
        </div>
      )}

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-grid">
          <div className="search-group">
            <label htmlFor="name">Nombre del Producto</label>
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
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Todas las categorías</option>
              <option value="FOOD">Comida</option>
              <option value="BEAUTY">Belleza</option>
              <option value="ENTERTAINMENT">Entretenimiento</option>
              <option value="OTHER">Otros</option>
            </select>
          </div>

          <div className="search-group">
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

        <div className="search-actions">
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
          <button type="button" className="clear-btn" onClick={clearFilters}>
            Limpiar
          </button>
        </div>
      </form>

      {products.length > 0 && (
        <div className="products-results">
          <div className="results-header">
            <p>Se encontraron {products.length} productos</p>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.pid}
                className="product-card clickable"
                onClick={(e) => handleCardClick(product, e)}
              >
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <span
                    className={`product-category ${product.category.toLowerCase()}`}
                  >
                    {formatCategory(product.category)}
                  </span>
                </div>

                <div className="product-body">
                  <p className="product-description">{product.description}</p>
                </div>

                {userRole === "ADMINISTRATOR" && (
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(product);
                      }}
                      title="Editar producto"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.pid);
                      }}
                      title="Eliminar producto"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                )}

                <div className="product-footer">
                  <span className="product-date">
                    {new Date(product.createdAt).toLocaleDateString("es-GT")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
          </div>
          <h3>No se encontraron productos</h3>
          <p>
            Realiza una búsqueda o{" "}
            {userRole === "ADMINISTRATOR"
              ? "crea un nuevo producto"
              : "modifica los filtros"}
          </p>
        </div>
      )}

      {showCreateForm && (
        <CreateProductForm
          userRole={userRole}
          editingProduct={editingProduct}
          onSuccess={handleCreateSuccess}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {expandedProduct && (
        <div className="expanded-overlay" onClick={handleCloseExpanded}>
          <div className="expanded-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseExpanded}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>

            <div className="expanded-content">
              <div className="expanded-header">
                <h2 className="expanded-title">{expandedProduct.name}</h2>
                <span
                  className={`expanded-category ${expandedProduct.category.toLowerCase()}`}
                >
                  {formatCategory(expandedProduct.category)}
                </span>
              </div>

              <div className="expanded-body">
                <div className="expanded-section">
                  <h3>Descripción</h3>
                  <p className="expanded-description">
                    {expandedProduct.description}
                  </p>
                </div>

                <div className="expanded-section">
                  <h3>Información del Producto</h3>
                  <div className="expanded-details">
                    <div className="detail-row">
                      <span className="detail-label">ID del Producto:</span>
                      <span className="detail-value">
                        {expandedProduct.pid}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Categoría:</span>
                      <span className="detail-value">
                        {formatCategory(expandedProduct.category)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fecha de Creación:</span>
                      <span className="detail-value">
                        {new Date(expandedProduct.createdAt).toLocaleString(
                          "es-GT",
                        )}
                      </span>
                    </div>
                    {expandedProduct.updatedAt && (
                      <div className="detail-row">
                        <span className="detail-label">
                          Última Actualización:
                        </span>
                        <span className="detail-value">
                          {new Date(expandedProduct.updatedAt).toLocaleString(
                            "es-GT",
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {userRole === "ADMINISTRATOR" && (
                <div className="expanded-actions">
                  <button
                    className="edit-btn-expanded"
                    onClick={() => {
                      handleEditProduct(expandedProduct);
                      setExpandedProduct(null);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                    Editar Producto
                  </button>
                  <button
                    className="delete-btn-expanded"
                    onClick={() => {
                      handleDeleteProduct(expandedProduct.pid);
                      setExpandedProduct(null);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                    Eliminar Producto
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
