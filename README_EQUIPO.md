# 👥 MindSchool - Guía para el Equipo de Desarrollo

## 🚀 **Inicio Rápido**

### **Para nuevos miembros del equipo:**

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPO]
   cd bkl_mindschool
   ```

2. **Instalar dependencias**
   ```bash
   # Frontend
   cd frontend && npm install && cd ..
   
   # Backend
   cd backend && composer install && cd ..
   ```

3. **Configurar entorno**
   ```bash
   cd backend
   cp .env.example .env
   # Editar .env con tu configuración local
   ```

4. **Ejecutar migraciones**
   ```bash
   cd backend
   php artisan migrate
   php artisan db:seed
   ```

## 🔄 **Comandos Útiles**

### **Desarrollo Local:**
```bash
# Frontend (puerto 5173)
cd frontend && npm run dev

# Backend (puerto 8000)
cd backend && php artisan serve
```

### **Testing:**
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && php artisan test
```

### **Build y Deploy:**
```bash
# Deploy automático (recomendado)
./deploy-equipo.sh

# Build manual
cd frontend && npm run build
./build-for-hosting.sh
```

## 📁 **Estructura del Proyecto**

```
bkl_mindschool/
├── frontend/                 # React App
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # Laravel API
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── composer.json
├── docs/                     # Documentación
├── hosting-build/            # Build para hosting
├── public_html/              # Archivos para Hostinger
├── deploy-equipo.sh          # Script de deploy
└── README_EQUIPO.md          # Este archivo
```

## 🌐 **URLs Importantes**

### **Desarrollo Local:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`

### **Producción (Hostinger):**
- Frontend: `https://green-monkey-737947.hostingersite.com/frontend/`
- Backend API: `https://green-monkey-737947.hostingersite.com/backend/public/api`

## 🔧 **Configuración de Base de Datos**

### **Local (.env):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mindschool_local
DB_USERNAME=root
DB_PASSWORD=
```

### **Hostinger:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_database_hostinger
DB_USERNAME=tu_usuario_hostinger
DB_PASSWORD=tu_password_hostinger
```

## 📝 **Convenciones de Código**

### **Frontend (React):**
- Componentes funcionales con hooks
- Nombres de archivos en PascalCase
- CSS modules o styled-components
- Commits en español

### **Backend (Laravel):**
- Seguir convenciones Laravel
- Resource Controllers
- Form Requests para validación
- Commits en español

## 🔄 **Git Workflow**

### **Ramas:**
- `main` - Código estable (producción)
- `develop` - Desarrollo activo
- `feature/nombre-feature` - Nuevas características

### **Proceso de trabajo:**
```bash
# 1. Crear rama para nueva feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: agregar funcionalidad de login"

# 3. Push a la rama
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request a develop
# 5. Después de review, merge a develop
# 6. Cuando esté listo, merge develop a main
```

## 🚀 **Deploy a Producción**

### **Proceso Automatizado (Recomendado):**
```bash
# 1. Asegurarse de estar en main
git checkout main
git pull origin main

# 2. Ejecutar script de deploy
./deploy-equipo.sh

# 3. Seguir las instrucciones del script
```

### **Proceso Manual:**
```bash
# 1. Build del frontend
cd frontend && npm run build && cd ..

# 2. Preparar archivos para hosting
./build-for-hosting.sh

# 3. Crear ZIP
cd public_html && zip -r ../deploy.zip . && cd ..

# 4. Subir deploy.zip a Hostinger
```

## 📋 **Checklist Antes de Deploy**

- [ ] Tests pasando (`npm test` y `php artisan test`)
- [ ] Build del frontend exitoso
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Código revisado y aprobado
- [ ] Archivos estáticos optimizados

## 🆘 **Problemas Comunes y Soluciones**

### **Error 404 en archivos estáticos:**
- Verificar rutas relativas en `frontend/dist/index.html`
- Revisar configuración `.htaccess`

### **Error 500 en backend:**
- Verificar configuración `.env`
- Revisar logs: `cd backend && php artisan log:clear`

### **CORS errors:**
- Verificar `backend/config/cors.php`
- Asegurar que las URLs estén en `allowed_origins`

### **Error de dependencias:**
```bash
# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install

# Backend
cd backend && rm -rf vendor composer.lock && composer install
```

## 📞 **Contacto y Recursos**

- **Líder del proyecto**: [Tu nombre]
- **Repositorio**: [URL del repo]
- **Documentación completa**: `docs/`
- **Issues**: [URL de issues]

## 🔄 **Actualizaciones del Proyecto**

### **Para mantener el proyecto actualizado:**
```bash
# Frontend
cd frontend && npm update && cd ..

# Backend
cd backend && composer update && cd ..
```

### **Verificar cambios importantes:**
- Revisar `CHANGELOG.md`
- Verificar `package.json` y `composer.json`
- Probar funcionalidades críticas

---

**Última actualización**: $(date)  
**Versión del proyecto**: 1.0  
**Equipo**: MindSchool Development Team 