import React, { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import CreateUserWithAccountForm from "./CreateUserWithAccountForm";
import CreateAccountForm from "./CreateAccountForm";
import "./CreateUserOptions.css";

const CreateUserOptions = ({ userRole, onClose, initialOption = null }) => {
  const [selectedOption, setSelectedOption] = useState(initialOption);

  const options = [
    {
      id: "create-user",
      title: "Crear Usuario",
      description: "Crear un usuario sin cuenta bancaria",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
        </svg>
      ),
      available: true,
    },
    {
      id: "create-user-with-account",
      title: "Crear Usuario con Cuenta",
      description: "Crear un usuario cliente con su primera cuenta bancaria",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.71,4.29C19.19,5.79 20,7.79 20,10C20,12.21 19.19,14.21 17.71,15.71C16.21,17.19 14.21,18 12,18C9.79,18 7.79,17.19 6.29,15.71C4.81,14.21 4,12.21 4,10C4,7.79 4.81,5.79 6.29,4.29C7.79,2.81 9.79,2 12,2M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20Z" />
        </svg>
      ),
      available: true,
    },
    {
      id: "create-account",
      title: "Crear Cuenta Bancaria",
      description: "Crear una cuenta para un cliente existente",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
        </svg>
      ),
      available: true,
    },
  ];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  if (selectedOption) {
    return (
      <div className="create-user-options-modal">
        <div className="modal-content">
          <div className="modal-header">
            <button className="back-btn" onClick={handleBack}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.59L5.83,13H19V17H21V7H19Z" />
              </svg>
              Volver
            </button>
            <button className="close-btn" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>
          <div className="form-container">
            {selectedOption === "create-user" && (
              <CreateUserForm userRole={userRole} onSuccess={onClose} />
            )}
            {selectedOption === "create-user-with-account" && (
              <CreateUserWithAccountForm
                userRole={userRole}
                onSuccess={onClose}
              />
            )}
            {selectedOption === "create-account" && (
              <CreateAccountForm userRole={userRole} onSuccess={onClose} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-user-options-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Opciones de Creación</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <div className="options-grid">
          {options.map((option) => (
            <div
              key={option.id}
              className={`option-card ${!option.available ? "disabled" : ""}`}
              onClick={() => option.available && handleOptionSelect(option.id)}
            >
              <div className="option-icon">{option.icon}</div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateUserOptions;
