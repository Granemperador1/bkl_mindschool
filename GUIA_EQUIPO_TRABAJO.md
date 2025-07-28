# 👥 Guía para el Equipo de Trabajo - MindSchool

## 🚀 **Configuración Inicial para Nuevos Miembros**

### 1. **Clonar el Repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd bkl_mindschool
```

### 2. **Instalar Dependencias**
```bash
# Frontend (React)
cd frontend
npm install

# Backend (Laravel)
cd ../backend
composer install
```

### 3. **Configurar Variables de Entorno**
```bash
# Backend - Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con configuración local
nano .env
```

## 📁 **Estructura del Proyecto**

```
bkl_mindschool/
├── frontend/          # React App
├── backend/           # Laravel API
├── docs/             # Documentación
├── setup/            # Scripts de configuración
├── hosting-build/    # Build para hosting
└── public_html/      # Archivos para Hostinger
```

## 🔄 **Flujo de Trabajo**

### **Para Desarrollo Local:**

1. **Frontend (React)**
   ```bash
   cd frontend
   npm run dev
   # Accede a: http://localhost:5173
   ```

2. **Backend (Laravel)**
   ```bash
   cd backend
   php artisan serve
   # Accede a: http://localhost:8000
   ```

### **Para Testing:**
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
php artisan test
```

## 📦 **Build para Hosting**

### **Cuando hagas cambios importantes:**

1. **Build del Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copiar archivos al hosting-build**
   ```bash
   # Ejecutar script de build
   ./build-for-hosting.sh
   ```

3. **Crear nuevo ZIP para Hostinger**
   ```bash
   cd public_html
   zip -r ../public_html_nuevo.zip .
   ```

## 🔧 **Configuración de Base de Datos**

### **Local:**
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

## 🌐 **URLs de Desarrollo**

### **Local:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`

### **Hostinger:**
- Frontend: `https://green-monkey-737947.hostingersite.com/frontend/`
- Backend API: `https://green-monkey-737947.hostingersite.com/backend/public/api`

## 📝 **Convenciones de Código**

### **Frontend (React):**
- Usar componentes funcionales con hooks
- Nombres de archivos en PascalCase
- CSS modules o styled-components

### **Backend (Laravel):**
- Seguir convenciones Laravel
- Usar Resource Controllers
- Validación con Form Requests

## 🔄 **Git Workflow**

### **Ramas:**
- `main` - Código estable
- `develop` - Desarrollo activo
- `feature/nombre-feature` - Nuevas características

### **Commits:**
```bash
git add .
git commit -m "feat: agregar funcionalidad de login"
git push origin feature/nombre-feature
```

## 🚀 **Deploy a Hostinger**

### **Proceso Automatizado:**
1. Hacer merge a `main`
2. Ejecutar `./build-for-hosting.sh`
3. Subir `public_html_nuevo.zip` a Hostinger
4. Verificar con `node verificar-solucion.js`

## 📋 **Checklist Antes de Deploy**

- [ ] Tests pasando
- [ ] Build del frontend exitoso
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Archivos estáticos optimizados

## 🆘 **Problemas Comunes**

### **Error 404 en archivos estáticos:**
- Verificar rutas relativas en `index.html`
- Revisar configuración `.htaccess`

### **Error 500 en backend:**
- Verificar configuración `.env`
- Revisar logs de Laravel

### **CORS errors:**
- Verificar configuración en `backend/config/cors.php`

## 📞 **Contacto**

- **Líder del proyecto**: [Tu nombre]
- **Repositorio**: [URL del repo]
- **Documentación**: `docs/`

---

**Última actualización**: $(date)
**Versión**: 1.0 