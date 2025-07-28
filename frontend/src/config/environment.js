// Configuración de entorno para el frontend
const environment = {
  development: {
    API_URL: 'http://localhost:8000/api',
    BASE_URL: 'http://localhost:5173'
  },
  production: {
    API_URL: 'https://tu-dominio.com/api', // Cambiar por tu dominio real
    BASE_URL: 'https://tu-dominio.com'
  }
};

const currentEnv = import.meta.env.MODE || 'development';
const config = environment[currentEnv];

export default config;
