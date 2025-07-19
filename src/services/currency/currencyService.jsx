import axios from "axios";

// Note: In production, the API key should be stored in environment variables
// For now, we'll use a placeholder that should be replaced with actual implementation
const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY || "YOUR_API_KEY_HERE";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

/**
 * Supported currencies for conversion
 */
export const SUPPORTED_CURRENCIES = {
  GTQ: "Quetzal Guatemalteco",
  USD: "Dólar Estadounidense",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  CAD: "Dólar Canadiense",
  MXN: "Peso Mexicano",
  COP: "Peso Colombiano",
  CRC: "Colón Costarricense",
  HNL: "Lempira Hondureño",
  NIO: "Córdoba Nicaragüense",
  PAB: "Balboa Panameño",
  JPY: "Yen Japonés",
  CNY: "Yuan Chino",
  BRL: "Real Brasileño",
  ARS: "Peso Argentino",
};

/**
 * Converts an amount from one currency to another
 * @param {number} amount - Original amount
 * @param {string} fromCurrency - Source currency (e.g., 'GTQ')
 * @param {string} toCurrency - Target currency (e.g., 'USD')
 * @returns {Promise<number>} Converted amount
 */
export const convertBalance = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  try {
    const response = await axios.get(`${BASE_URL}${fromCurrency}`);
    const rate = response.data.conversion_rates[toCurrency];

    if (!rate) {
      throw new Error(`La moneda ${toCurrency} no está soportada`);
    }

    const converted = amount * rate;
    return parseFloat(converted.toFixed(2));
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Clave de API de conversión inválida");
    } else if (error.response?.status === 403) {
      throw new Error("Límite de solicitudes de conversión excedido");
    } else if (error.message.includes("soportada")) {
      throw error;
    } else {
      throw new Error(
        "No se pudo convertir el saldo. Verifique su conexión a internet.",
      );
    }
  }
};

/**
 * Gets current exchange rates for a base currency
 * @param {string} baseCurrency - Base currency (e.g., 'GTQ')
 * @returns {Promise<object>} Exchange rates object
 */
export const getExchangeRates = async (baseCurrency = "GTQ") => {
  try {
    const response = await axios.get(`${BASE_URL}${baseCurrency}`);
    return response.data.conversion_rates;
  } catch (error) {
    throw new Error("No se pudieron obtener las tasas de cambio");
  }
};

/**
 * Formats currency amount with proper symbol and formatting
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  const currencySymbols = {
    GTQ: "Q",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    MXN: "MX$",
    COP: "COL$",
    CRC: "₡",
    HNL: "L",
    NIO: "C$",
    PAB: "B/.",
    JPY: "¥",
    CNY: "¥",
    BRL: "R$",
    ARS: "AR$",
  };

  const symbol = currencySymbols[currency] || currency;
  const formattedAmount = new Intl.NumberFormat("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedAmount}`;
};

/**
 * Validates if a currency is supported
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if currency is supported
 */
export const isSupportedCurrency = (currency) => {
  return Object.keys(SUPPORTED_CURRENCIES).includes(currency);
};
