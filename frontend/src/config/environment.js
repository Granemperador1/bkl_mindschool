// Configuración de entorno para el frontend
export const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "MindSchool",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export default config;
