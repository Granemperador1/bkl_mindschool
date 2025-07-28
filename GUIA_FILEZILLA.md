# 📁 Guía para subir archivos con FileZilla

## 🔧 Configuración de FileZilla

### 1. Descargar FileZilla
- Ve a: https://filezilla-project.org/
- Descarga FileZilla Client (gratuito)

### 2. Configurar conexión FTP
```
Servidor: tu-dominio.com (o la IP que te dio Hostinger)
Usuario: tu-usuario-ftp
Contraseña: tu-password-ftp
Puerto: 21 (FTP) o 22 (SFTP)
```

### 3. Conectar y subir archivos

#### Paso 1: Conectar
1. Abre FileZilla
2. Ingresa los datos de conexión
3. Haz clic en "Conectar"

#### Paso 2: Navegar
1. En el panel derecho (servidor), navega a `public_html/`
2. En el panel izquierdo (local), navega a tu carpeta `bkl_mindschool/public_html/`

#### Paso 3: Subir archivos
1. Selecciona TODOS los archivos y carpetas del panel izquierdo
2. Arrastra al panel derecho (servidor)
3. Confirma la subida

## 📁 Estructura que debe quedar en Hostinger

```
public_html/
├── .htaccess ✅
├── index.php ✅
├── frontend/
│   ├── index.html ✅
│   ├── assets/ ✅
│   └── config.js ✅
└── backend/
    ├── public/
    │   ├── index.php ✅
    │   └── .htaccess ✅
    ├── app/ ✅
    ├── config/ ✅
    └── ... (resto de Laravel) ✅
```

## ⚠️ Importante

- **Permisos**: Los archivos deben tener permisos 644
- **Carpetas**: Las carpetas deben tener permisos 755
- **Tiempo**: Espera 2-5 minutos después de subir

## 🔍 Verificación

Después de subir, ejecuta:
```bash
node verificar-solucion.js
``` 