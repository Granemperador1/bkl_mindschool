# 🎓 MindSchool - Sistema de Gestión de Aprendizaje

[![Laravel](https://img.shields.io/badge/Laravel-10-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.1-purple.svg)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com)
[![Version](https://img.shields.io/badge/Version-Beta-green.svg)](https://github.com/Granemperador1/miprojecto_mindschool)

## 🚀 **Versión Beta v1.0.0**

**MindSchool** ha evolucionado de una versión alfa a una versión beta robusta con las siguientes mejoras:

### ✨ **Nuevas Características Beta:**

#### **Frontend (React)**
- ✅ **Validaciones en tiempo real** en todos los formularios
- ✅ **Error Boundaries** para capturar errores inesperados
- ✅ **Hook personalizado de validación** reutilizable
- ✅ **Manejo de errores mejorado** con UI amigable
- ✅ **Tests unitarios** con cobertura >80%

#### **Backend (Laravel)**
- ✅ **Rate limiting avanzado** por tipo de endpoint
- ✅ **Logging estructurado** para auditoría completa
- ✅ **Middleware de logging** para API requests/responses
- ✅ **Validaciones robustas** en todos los endpoints
- ✅ **Tests unitarios** para traits y servicios

#### **Seguridad y Performance**
- ✅ **Rate limiting diferenciado** (auth: 5/min, critical: 30/min, uploads: 10/min)
- ✅ **Logging de errores** con contexto completo
- ✅ **Validaciones de entrada** sanitizadas
- ✅ **Manejo de errores global** estandarizado

### 🔧 **Mejoras Técnicas:**
- **Arquitectura mejorada** con separación clara de responsabilidades
- **Código más mantenible** con patrones consistentes
- **Documentación actualizada** con ejemplos de uso
- **Testing automatizado** para regresiones

## 📋 Descripción del Proyecto

MindSchool es un sistema completo de gestión de aprendizaje (LMS) desarrollado con **Laravel 10** en el backend y **React 18** en el frontend. El sistema permite gestionar cursos, estudiantes, profesores, calificaciones, tareas y mucho más.

## 🚀 Características Principales

### 👨‍🏫 Panel de Profesores

- **Gestión de Cursos**: Crear, editar y administrar cursos
- **Gestión de Estudiantes**: Matricular y gestionar estudiantes
- **Sistema de Calificaciones**: Calificar tareas y exámenes
- **Gestión de Tareas**: Crear y revisar tareas
- **Sistema de Asistencias**: Control de asistencia a clases
- **Mensajería**: Comunicación con estudiantes
- **Recursos Multimedia**: Subir y gestionar recursos educativos

### 👨‍🎓 Panel de Estudiantes

- **Dashboard Personalizado**: Vista general del progreso
- **Cursos Inscritos**: Acceso a cursos matriculados
- **Tareas y Entregas**: Ver y entregar tareas
- **Calificaciones**: Consultar notas y progreso
- **Mensajería**: Comunicación con profesores

### 👨‍💼 Panel de Administradores

- **Gestión de Usuarios**: Administrar todos los usuarios del sistema
- **Gestión de Cursos**: Supervisar todos los cursos
- **Analytics**: Estadísticas y reportes del sistema
- **Configuración del Sistema**: Ajustes generales

## 🛠️ Tecnologías Utilizadas

### Backend

- **Laravel 10** - Framework PHP
- **MySQL 8.0** - Base de datos
- **Laravel Sanctum** - Autenticación API
- **Laravel Spatie** - Gestión de roles y permisos
- **PHPUnit** - Testing

### Frontend

- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **Jest** - Testing

## 📁 Estructura del Proyecto

```
miprojecto_mindschool/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── docs/                   # Documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- PHP 8.1 o superior
- Composer
- Node.js 16+ y npm
- PostgreSQL 16+ (si no usas Docker)
- Docker y Docker Compose (recomendado)
- Git

### Backend (Laravel)

1. **Clonar el repositorio**

```bash
git clone https://github.com/Granemperador1/miprojecto_mindschool.git
cd miprojecto_mindschool
```

2. **Copia el archivo de entorno y levanta el entorno con Docker Compose**

```bash
cp backend/.env.example backend/.env
docker-compose up -d
```

3. **Accede a la aplicación:**
- Frontend: http://localhost:5173
- Backend/API: http://localhost:8000

4. **(Opcional) Ejecuta migraciones y seeders:**
```bash
docker-compose exec backend php artisan migrate --seed
```

### Frontend (React)

1. **Navegar al directorio frontend**

```bash
cd ../frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
php artisan test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📚 API Documentation

La documentación completa de la API está disponible en:

- `docs/API_ROUTES_DOCUMENTATION.md`
- `docs/api_routes.txt`

### Endpoints Principales

#### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/logout` - Cerrar sesión

#### Cursos

- `GET /api/cursos` - Listar cursos
- `POST /api/cursos` - Crear curso
- `GET /api/cursos/{id}` - Obtener curso específico
- `PUT /api/cursos/{id}` - Actualizar curso
- `DELETE /api/cursos/{id}` - Eliminar curso

#### Usuarios

- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios/{id}` - Obtener usuario específico
- `PUT /api/usuarios/{id}` - Actualizar usuario

## 🔐 Roles y Permisos

El sistema incluye tres roles principales:

1. **Administrador**: Acceso completo al sistema
2. **Profesor**: Gestión de cursos y estudiantes
3. **Estudiante**: Acceso a cursos matriculados

## 📊 Base de Datos

El sistema incluye las siguientes tablas principales:

- `users` - Usuarios del sistema
- `cursos` - Cursos disponibles
- `inscripciones` - Matrículas de estudiantes
- `lecciones` - Lecciones de cada curso
- `tareas` - Tareas asignadas
- `calificaciones` - Calificaciones de estudiantes
- `asistencias` - Control de asistencia

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Granemperador1** - [GitHub](https://github.com/Granemperador1)

## 📞 Contacto

- Email: sanguinius966@gmail.com
- GitHub: [@Granemperador1](https://github.com/Granemperador1)

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella!
