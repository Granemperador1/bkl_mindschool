# 🎓 MindSchool - Plataforma Educativa Integral

## 📋 Descripción

MindSchool es una plataforma educativa completa que conecta estudiantes, profesores y administradores en un entorno de aprendizaje digital moderno. Desarrollada con tecnologías web avanzadas, ofrece una experiencia educativa personalizada y escalable.

## 🚀 Características Principales

### 👨‍🎓 **Para Estudiantes**
- Dashboard personalizado con progreso académico
- Acceso a cursos y materiales multimedia
- Sistema de calificaciones y evaluaciones
- Reserva de asesorías personalizadas
- Gestión de tareas y entregas
- Notificaciones en tiempo real

### 👨‍🏫 **Para Profesores**
- Panel de gestión de cursos
- Herramientas de evaluación y calificación
- Gestión de contenido multimedia
- Análisis de rendimiento estudiantil
- Sistema de asesorías programadas
- Creación de exámenes y tareas

### 👨‍💼 **Para Administradores**
- Gestión completa de usuarios
- Análisis de métricas y analytics
- Configuración del sistema
- Gestión de pagos y transacciones
- Reportes y exportaciones

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** - Framework principal
- **Vite** - Build tool y desarrollo
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos
- **JavaScript ES6+** - Lógica de aplicación

### **Backend**
- **Laravel 10** - Framework PHP
- **MySQL** - Base de datos principal
- **MongoDB** - Almacenamiento multimedia
- **Sanctum** - Autenticación API
- **Eloquent ORM** - Modelos de datos
- **PHP 8.1+** - Lenguaje del servidor

### **Infraestructura**
- **Hostinger** - Hosting web
- **Git** - Control de versiones
- **Composer** - Gestión de dependencias PHP
- **npm** - Gestión de dependencias Node.js

## 📁 Estructura del Proyecto

```
bkl_mindschool/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── context/        # Contexto de autenticación
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── servicios/      # Servicios API
│   │   └── theme/          # Configuración de temas
│   └── public/             # Archivos estáticos
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/           # Controladores y middleware
│   │   ├── Models/         # Modelos Eloquent
│   │   ├── Services/       # Lógica de negocio
│   │   └── Exports/        # Exportaciones de datos
│   ├── database/           # Migraciones y seeders
│   ├── routes/             # Definición de rutas
│   └── config/             # Configuraciones
├── public_html/            # Archivos para hosting
├── docs/                   # Documentación
└── setup/                  # Scripts de configuración
```

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Node.js 18+
- PHP 8.1+
- Composer
- MySQL 8.0+
- MongoDB (opcional)

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/mindschool.git
cd mindschool
```

### **2. Configurar Backend**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### **3. Configurar Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **4. Configurar Variables de Entorno**
```bash
# Backend (.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mindschool
DB_USERNAME=root
DB_PASSWORD=

# Frontend (config/environment.js)
VITE_API_URL=http://localhost:8000/api
```

## 🌐 Despliegue

### **Despliegue en Hostinger**
1. Subir archivos a `public_html/`
2. Configurar base de datos MySQL
3. Configurar variables de entorno
4. Ejecutar migraciones

### **Scripts de Despliegue**
```bash
# Construir para producción
./build-for-hosting.sh

# Subir a Hostinger
./subir-hostinger-real.sh
```

## 📊 Base de Datos

### **Tablas Principales**
- `users` - Usuarios del sistema
- `cursos` - Cursos disponibles
- `lecciones` - Contenido de cursos
- `calificaciones` - Evaluaciones
- `tareas` - Tareas asignadas
- `asesorias` - Citas de asesoría
- `transacciones` - Pagos y facturación

## 🔐 Autenticación y Autorización

- **Sanctum** para autenticación API
- **Roles y permisos** granulares
- **JWT tokens** para sesiones
- **Middleware** de seguridad

## 📱 Características Técnicas

### **Frontend**
- ✅ Responsive design
- ✅ PWA ready
- ✅ Lazy loading
- ✅ Error boundaries
- ✅ Optimización de rendimiento

### **Backend**
- ✅ API RESTful
- ✅ Validación de datos
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Logging avanzado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UX/UI**: [Diseñador]
- **Testing**: [QA]

## 📞 Soporte

- **Email**: soporte@mindschoo.store
- **Documentación**: [Link a docs]
- **Issues**: [GitHub Issues]

## 🗺️ Roadmap

- [ ] Integración con Zoom/Meet
- [ ] App móvil nativa
- [ ] IA para recomendaciones
- [ ] Gamificación avanzada
- [ ] Integración con LMS externos

---

**Desarrollado con ❤️ para la educación del futuro** 