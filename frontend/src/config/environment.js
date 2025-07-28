// Configuración de entorno para el frontend
const environment = {
  development: {
    API_URL: 'http://localhost:8001/api',
    BASE_URL: 'http://localhost:5175',
    TIMEOUT: 10000
  },
  production: {
    API_URL: 'https://green-monkey-737947.hostingersite.com/backend/public/api',
    BASE_URL: 'https://green-monkey-737947.hostingersite.com',
    TIMEOUT: 10000
  }
};

const currentEnv = import.meta.env.MODE || 'development';
const config = environment[currentEnv];

export default config;
