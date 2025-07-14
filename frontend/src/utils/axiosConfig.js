import axios from "axios";
import config from "../config/environment";

// Configuración base de Axios
const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.defaults.withCredentials = true;

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Error de servidor (4xx, 5xx)
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Acceso denegado
          console.error("Acceso denegado");
          break;
        case 422:
          // Error de validación
          console.error("Error de validación:", error.response.data.errors);
          break;
        case 500:
          // Error interno del servidor
          console.error("Error interno del servidor");
          break;
        default:
          console.error("Error de red:", error.response.data);
      }
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      console.error("Error de conexión: No se pudo conectar al servidor");
    } else {
      // Error en la configuración de la petición
      console.error("Error de configuración:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
