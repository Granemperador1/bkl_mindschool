# 📋 Instrucciones para el Equipo de MindSchool

## 🎯 **¿Qué debe hacer el equipo?**

### **1. Configuración Inicial (Solo la primera vez)**

Cada miembro del equipo debe seguir estos pasos:

```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd bkl_mindschool

# 2. Instalar dependencias
cd frontend && npm install && cd ..
cd backend && composer install && cd ..

# 3. Configurar entorno
cd backend
cp .env.example .env
# Editar .env con configuración local
nano .env

# 4. Configurar base de datos
php artisan migrate
php artisan db:seed
```

### **2. Desarrollo Diario**

```bash
# Iniciar servidores de desarrollo
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend  
cd backend && php artisan serve
```

### **3. Cuando hagas cambios importantes**

```bash
# 1. Hacer commit de tus cambios
git add .
git commit -m "feat: descripción de los cambios"
git push origin tu-rama

# 2. Crear Pull Request a develop
# 3. Después de review, merge a develop
# 4. Cuando esté listo para producción, merge develop a main
```

### **4. Deploy a Producción**

```bash
# Opción 1: Automático (Recomendado)
./deploy-equipo.sh

# Opción 2: Manual
cd frontend && npm run build && cd ..
./build-for-hosting.sh
cd public_html && zip -r ../deploy.zip . && cd ..
```

## 📁 **Archivos Importantes para el Equipo**

- `README_EQUIPO.md` - Guía completa del equipo
- `GUIA_EQUIPO_TRABAJO.md` - Flujo de trabajo detallado
- `deploy-equipo.sh` - Script de deploy automático
- `build-for-hosting.sh` - Script de build para hosting
- `verificar-solucion.js` - Verificación del sitio en producción

## 🔄 **Flujo de Trabajo Recomendado**

### **Para nuevas funcionalidades:**

1. **Crear rama**
   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```

2. **Desarrollar**
   - Hacer cambios en frontend y/o backend
   - Probar localmente
   - Hacer commits frecuentes

3. **Testing**
   ```bash
   # Frontend
   cd frontend && npm test
   
   # Backend
   cd backend && php artisan test
   ```

4. **Pull Request**
   - Crear PR a `develop`
   - Solicitar review
   - Hacer merge después de aprobación

5. **Deploy**
   - Merge `develop` a `main`
   - Ejecutar `./deploy-equipo.sh`
   - Verificar en producción

## 🌐 **URLs de Referencia**

### **Desarrollo:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

### **Producción:**
- Frontend: `https://green-monkey-737947.hostingersite.com/frontend/`
- Backend: `https://green-monkey-737947.hostingersite.com/backend/public/`

## ⚠️ **Reglas Importantes**

### **Antes de hacer deploy:**
- [ ] Tests pasando
- [ ] Código revisado
- [ ] Build exitoso
- [ ] Variables de entorno configuradas

### **Convenciones de código:**
- Commits en español
- Nombres descriptivos para ramas
- Documentar cambios importantes

### **Problemas comunes:**
- Si hay errores 404: Verificar rutas en `index.html`
- Si hay errores 500: Revisar configuración `.env`
- Si hay CORS: Verificar `backend/config/cors.php`

## 📞 **Comunicación**

- **Líder del proyecto**: [Tu nombre]
- **Canal de comunicación**: [Slack/Discord/Teams]
- **Repositorio**: [URL del repo]
- **Issues**: [URL de issues]

## 🚀 **Comandos Rápidos**

```bash
# Desarrollo
./deploy-equipo.sh          # Deploy completo
npm run dev                 # Frontend local
php artisan serve           # Backend local
npm test                    # Tests frontend
php artisan test            # Tests backend

# Verificación
node verificar-solucion.js  # Verificar producción
```

---

**Importante**: Siempre consulta `README_EQUIPO.md` para información detallada.

**Última actualización**: $(date) 