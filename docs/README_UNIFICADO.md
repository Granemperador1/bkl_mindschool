# 🎓 MindSchool - Documentación Unificada

## 📋 Descripción General

MindSchool es un sistema de gestión de aprendizaje (LMS) completo, desarrollado con Laravel (PHP) en el backend y React (Vite) en el frontend. Permite la administración de cursos, usuarios, profesores, estudiantes, calificaciones, tareas y más, con enfoque en modularidad, seguridad y experiencia de usuario.

---

## 📁 Estructura del Proyecto

```
miprojecto_mindschool/
├── backend/      # API Laravel
│   ├── app/      # Modelos, controladores, servicios, repositorios, validadores
│   ├── config/   # Configuración de Laravel
│   ├── database/ # Migraciones, seeders, factories
│   ├── routes/   # Rutas API y web
│   ├── tests/    # Pruebas unitarias y de integración
│   └── ...
├── frontend/     # Aplicación React
│   ├── src/      # Componentes, páginas, hooks, contextos, temas, servicios
│   ├── public/   # Archivos estáticos
│   └── ...
├── docs/         # Documentación y diagramas
├── optimize.sh   # Script de optimización
├── start_servers.sh / .bat # Scripts de arranque automático
└── docker-compose.yml      # Configuración Docker (opcional)
```

---

## ⚡ Instalación y Uso Rápido

### 1. Requisitos Previos

- PHP 8.2+
- Node.js 18+
- Composer
- npm
- MySQL o PostgreSQL (ajusta .env)

### 2. Clonar y Configurar

```bash
git clone <tu-repositorio>
cd miprojecto_mindschool
```

### 3. Backend (Laravel)

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales de base de datos
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 4. Frontend (React)

```bash
cd ../frontend
npm install
npm run dev
```

### 5. Arranque Automático (opcional)

- Linux/macOS: `./start_servers.sh`
- Windows: `start_servers.bat`

---

## 🛠️ Configuración de Base de Datos

### Ejemplo para PostgreSQL

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mindschool
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

### Ejemplo para MySQL

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mindschool
DB_USERNAME=root
DB_PASSWORD=tu_password
```

---

## 👥 Usuarios por Defecto

- **Administrador:** admin@mindschool.com / password
- **Profesor:** profesor@mindschool.com / password
- **Estudiante:** estudiante@mindschool.com / password

---

## 🔑 Comandos Útiles

### Backend

- Limpiar caché: `php artisan config:clear && php artisan cache:clear`
- Ver rutas API: `php artisan route:list --path=api`
- Ejecutar tests: `php artisan test`
- Crear usuario admin:

```php
php artisan tinker
User::create(['name' => 'Admin', 'email' => 'admin@mindschool.com', 'password' => Hash::make('password')])->assignRole('admin');
```

### Frontend

- Instalar dependencias: `npm install`
- Desarrollo: `npm run dev`
- Build producción: `npm run build`
- Ejecutar tests: `npm test`

---

## 🧑‍💻 Buenas Prácticas

- Código y comentarios en español.
- Modularización: cada página y componente en su propio archivo.
- Uso de Material UI y diseño responsivo.
- Consumo de API REST usando Axios.
- Navegación con React Router DOM.
- Validación robusta en backend y frontend.
- Seguridad: headers, roles, autenticación con Sanctum.
- Logging estructurado y rotación de logs.
- Tests unitarios y de integración (PHPUnit, Jest).
- Scripts de arranque y optimización automatizados.

---

## 🧹 Historial de Limpieza y Mejoras

- Eliminados archivos de prueba rápida, temporales y de respaldo.
- Eliminados archivos de dependencias (`package-lock.json`, `composer.phar`) del repo.
- Limpieza de logs, caché y archivos de entorno del repositorio.
- Refactorización de controladores y servicios.
- Modularización avanzada en frontend y backend.
- Implementación de middleware de seguridad y logging avanzado.
- Optimización de consultas y sistema de caché inteligente.
- Mejora de cobertura de tests y rendimiento.

---

## 📊 Estado Actual y Recomendaciones

- **Backend:** API RESTful robusta, autenticación y roles, tests críticos pasando, modularidad avanzada.
- **Frontend:** Componentes y páginas modulares, diseño moderno, autenticación integrada, conexión real con API.
- **Base de datos:** Esquema relacional optimizado, migraciones y seeders listos.
- **Documentación:** Unificada y actualizada en este archivo.

### Recomendaciones

- Completar tests faltantes y CI/CD pipeline.
- Mejorar documentación de API (Swagger recomendado).
- Optimizar consultas complejas y monitoreo de rendimiento.
- Completar panel de administración y funcionalidades pendientes.
- Mantener la limpieza y buenas prácticas en el repositorio.

---

## 📞 Soporte y Contacto

- Para problemas, revisa logs en `backend/storage/logs/laravel.log` y la consola del navegador.
- Contacto: sanguinius966@gmail.com | GitHub: @Granemperador1

---

**¡Listo! Tu aplicación MindSchool está documentada y lista para desarrollo y producción!** 🎉
