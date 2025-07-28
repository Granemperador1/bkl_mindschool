// Configuración de entorno para el frontend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Debug: Imprimir la URL que se está usando
console.log("🔧 Configuración de API:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL: API_URL,
  NODE_ENV: import.meta.env.NODE_ENV
});

export const config = {
  API_URL: API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME || "MindSchool",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export default config;
