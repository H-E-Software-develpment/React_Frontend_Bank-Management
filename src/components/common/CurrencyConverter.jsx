import React, { useState, useEffect } from "react";
import {
  convertBalance,
  SUPPORTED_CURRENCIES,
  formatCurrency,
  isSupportedCurrency,
} from "../../services/currency/currencyService";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "./Toast";
import "./CurrencyConverter.css";

const CurrencyConverter = ({
  amount,
  fromCurrency = "GTQ",
  showSelector = true,
  onConversionChange = null,
}) => {
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (amount && targetCurrency && fromCurrency !== targetCurrency) {
      handleConversion();
    } else if (fromCurrency === targetCurrency) {
      setConvertedAmount(amount);
    }
  }, [amount, fromCurrency, targetCurrency]);

  const handleConversion = async () => {
    if (!amount || amount <= 0) {
      setConvertedAmount(null);
      return;
    }

    setLoading(true);
    try {
      const converted = await convertBalance(
        amount,
        fromCurrency,
        targetCurrency,
      );
      setConvertedAmount(converted);

      if (onConversionChange) {
        onConversionChange({
          originalAmount: amount,
          convertedAmount: converted,
          fromCurrency,
          toCurrency: targetCurrency,
        });
      }
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    if (isSupportedCurrency(newCurrency)) {
      setTargetCurrency(newCurrency);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!amount || amount <= 0) {
    return null;
  }

  return (
    <div className={`currency-converter ${isExpanded ? "expanded" : ""}`}>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="converter-header" onClick={toggleExpanded}>
        <div className="original-amount">
          <span className="amount-label">Saldo Original:</span>
          <span className="amount-value">
            {formatCurrency(amount, fromCurrency)}
          </span>
        </div>

        {showSelector && (
          <button className="expand-btn" type="button">
            <svg
              className={`expand-icon ${isExpanded ? "rotated" : ""}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </button>
        )}
      </div>

      {isExpanded && showSelector && (
        <div className="converter-body">
          <div className="currency-selector">
            <label htmlFor="target-currency">Convertir a:</label>
            <select
              id="target-currency"
              value={targetCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {Object.entries(SUPPORTED_CURRENCIES).map(([code, name]) => (
                <option
                  key={code}
                  value={code}
                  disabled={code === fromCurrency}
                >
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          <div className="conversion-result">
            {loading ? (
              <div className="loading-conversion">
                <LoadingSpinner />
                <span>Convirtiendo...</span>
              </div>
            ) : convertedAmount !== null ? (
              <div className="converted-amount">
                <span className="result-label">Equivalente:</span>
                <span className="result-value">
                  {formatCurrency(convertedAmount, targetCurrency)}
                </span>
              </div>
            ) : (
              <div className="conversion-error">
                <span>No se pudo realizar la conversión</span>
              </div>
            )}
          </div>

          <div className="conversion-note">
            <small>
              Las tasas de cambio se actualizan automáticamente. Los valores son
              referenciales.
            </small>
          </div>
        </div>
      )}

      {!showSelector && convertedAmount !== null && (
        <div className="simple-conversion">
          <span className="conversion-arrow">≈</span>
          <span className="converted-value">
            {formatCurrency(convertedAmount, targetCurrency)}
          </span>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
