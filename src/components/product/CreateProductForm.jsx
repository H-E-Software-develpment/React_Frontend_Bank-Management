import React, { useState, useEffect } from "react";
import {
  createProduct,
  editProduct,
} from "../../services/product/productService";
import LoadingSpinner from "../common/LoadingSpinner";
import Toast from "../common/Toast";
import "./ProductManager.css";

const CreateProductForm = ({
  userRole,
  editingProduct,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "OTHER",
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
      });
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({
        type: "error",
        message: "El nombre del producto es obligatorio",
      });
      return;
    }

    if (!formData.description.trim()) {
      setToast({
        type: "error",
        message: "La descripción del producto es obligatoria",
      });
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
      };

      if (editingProduct) {
        await editProduct(editingProduct.pid, productData);
      } else {
        await createProduct(productData);
      }

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="form-header">
          <h2>{editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
          <p>Complete la información del producto</p>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength="100"
              placeholder="Nombre del producto o servicio"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="FOOD">Comida</option>
              <option value="BEAUTY">Belleza</option>
              <option value="ENTERTAINMENT">Entretenimiento</option>
              <option value="OTHER">Otros</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              maxLength="500"
              placeholder="Descripción detallada del producto o servicio"
            />
            <small className="char-count">
              {formData.description.length}/500 caracteres
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingProduct ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                  </svg>
                  {editingProduct ? "Actualizar Producto" : "Crear Producto"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
