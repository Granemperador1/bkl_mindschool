# Frontend - MindSchool

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend Laravel funcionando

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Crear archivo .env en la raíz del frontend
VITE_API_URL=http://localhost:8000/api
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Construir para producción:**
```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Navbar.jsx       # Barra de navegación
│   ├── LoadingSpinner.jsx # Spinner de carga
│   └── profesor/        # Componentes específicos de profesor
├── pages/               # Páginas principales
│   ├── Login.jsx        # Página de login
│   ├── AdminDashboard.jsx # Dashboard de admin
│   ├── ProfesorPanel.jsx # Panel de profesor
│   └── EstudianteDashboard.jsx # Dashboard de estudiante
├── context/             # Contextos de React
│   └── AuthContext.jsx  # Contexto de autenticación
├── hooks/               # Custom hooks
│   └── useApi.js        # Hook para llamadas API
├── services/            # Servicios de API
│   └── CursosServicio.js # Servicio de cursos
├── theme/               # Configuración de tema
│   ├── branding/        # Branding y logos
│   └── darkTheme.js     # Tema oscuro
└── utils/               # Utilidades
    └── axiosConfig.js   # Configuración de Axios
```

## Características

### Autenticación
- Login/Registro con validación
- Gestión de tokens JWT
- Protección de rutas por roles
- Context API para estado global

### Roles de Usuario
- **Admin**: Gestión completa del sistema
- **Profesor**: Gestión de cursos y estudiantes
- **Estudiante**: Acceso a cursos inscritos

### Componentes Principales
- **Navbar**: Navegación principal con menú por rol
- **RutaConRol**: Componente para proteger rutas
- **RedireccionPorRol**: Redirección automática según rol
- **LoadingSpinner**: Indicador de carga

### Temas y Estilos
- Material-UI como framework base
- Tema personalizado con colores de marca
- Componentes de branding (Logo, Mascota)
- Diseño responsive

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Generar reporte de cobertura
npm test -- --coverage
```

## Scripts Disponibles

- `npm run dev`: Servidor de desarrollo
- `npm run build`: Construir para producción
- `npm run preview`: Previsualizar build de producción
- `npm run lint`: Ejecutar ESLint
- `npm test`: Ejecutar tests

## Scripts útiles

- `start_servers.bat` (Windows): Inicia backend y frontend automáticamente.
- `start_servers.sh` (Linux/Mac): Inicia backend y frontend automáticamente.
- `start.sh`: Levanta todo el entorno usando Docker Compose.
- `optimize.sh`: Limpia y optimiza el proyecto.

## Configuración de API

El frontend se conecta al backend Laravel a través de Axios. La configuración se encuentra en `src/utils/axiosConfig.js`:

- Interceptores para tokens de autenticación
- Manejo de errores global
- Configuración de base URL

## Variables de Entorno

```env
# URL del backend API
VITE_API_URL=http://localhost:8000/api

# Modo de desarrollo
NODE_ENV=development
```

## Despliegue

1. **Construir la aplicación:**
```bash
npm run build
```

2. **Los archivos generados estarán en `dist/`**

3. **Configurar servidor web (Nginx/Apache) para servir los archivos estáticos**

## Troubleshooting

### Error de conexión con API
- Verificar que el backend esté corriendo
- Revisar `VITE_API_URL` en variables de entorno
- Verificar CORS en el backend

### Error de dependencias
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```
