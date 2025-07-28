# 🖥️ Guía para subir archivos desde el Panel de Hostinger

## 📋 Pasos en el Panel de Control

### 1. Acceder al Panel
1. Ve a https://hpanel.hostinger.com
2. Inicia sesión con tus credenciales
3. Selecciona tu dominio

### 2. Abrir Administrador de Archivos
1. En el menú lateral, busca "Archivos"
2. Haz clic en "Administrador de archivos"
3. Navega a la carpeta `public_html/`

### 3. Subir archivos

#### Opción A: Subir archivo por archivo
1. Haz clic en "Subir" o "Upload"
2. Selecciona los archivos uno por uno:
   - `.htaccess`
   - `index.php`
3. Para carpetas, crea primero la carpeta y luego sube su contenido

#### Opción B: Subir archivo ZIP (Recomendado)
1. Comprime tu carpeta `public_html/` en un archivo ZIP
2. Sube el archivo ZIP al servidor
3. Extrae el contenido en `public_html/`

### 4. Crear estructura de carpetas
```
public_html/
├── frontend/ (crear carpeta)
└── backend/ (crear carpeta)
    └── public/ (crear subcarpeta)
```

### 5. Subir contenido de carpetas
- **frontend/**: Sube todos los archivos de `hosting-build/`
- **backend/**: Sube todos los archivos de `backend/`

## ⚙️ Configurar permisos

### Archivos: 644
- `.htaccess`
- `index.php`
- Todos los archivos `.php`
- Archivos `.html`, `.css`, `.js`

### Carpetas: 755
- `frontend/`
- `backend/`
- `backend/public/`
- `frontend/assets/`

## 🔍 Verificar estructura final

Tu `public_html/` debe contener:
```
✅ .htaccess
✅ index.php
✅ frontend/
│   ├── index.html
│   ├── assets/
│   └── config.js
✅ backend/
    ├── public/
    │   ├── index.php
    │   └── .htaccess
    ├── app/
    ├── config/
    └── ... (resto de Laravel)
```

## ⏰ Después de subir

1. **Espera 2-5 minutos** para propagación
2. **Ejecuta verificación**: `node verificar-solucion.js`
3. **Prueba las URLs**:
   - https://green-monkey-737947.hostingersite.com
   - https://green-monkey-737947.hostingersite.com/frontend/
   - https://green-monkey-737947.hostingersite.com/backend/public/ 