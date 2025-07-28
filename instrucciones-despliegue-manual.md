# 🚀 Instrucciones de Despliegue Manual - MindSchool

## 📋 Resumen
Tu proyecto MindSchool está completamente preparado para desplegarse en Hostinger. Aquí tienes las instrucciones paso a paso.

## 📦 Archivos Listos
- ✅ `mindschoo-hostinger-completo.zip` (36MB) - Archivo completo listo para subir
- ✅ Scripts de configuración creados
- ✅ Backend optimizado para producción
- ✅ Frontend construido para producción

## 🔧 Pasos para Desplegar

### 1. Acceder al Panel de Hostinger
1. Ve a https://hpanel.hostinger.com
2. Inicia sesión con tus credenciales:
   - **Usuario**: u721653891
   - **Contraseña**: Sa829801114.

### 2. Subir el Archivo ZIP
1. En el panel de Hostinger, busca "Administrador de archivos"
2. Navega a la carpeta `public_html/`
3. Haz clic en "Subir archivo"
4. Selecciona el archivo `mindschoo-hostinger-completo.zip`
5. Espera a que se complete la subida

### 3. Extraer el Archivo ZIP
1. Una vez subido, haz clic derecho en el archivo ZIP
2. Selecciona "Extraer"
3. Extrae todo el contenido en `public_html/`
4. Esto creará la estructura completa del sitio

### 4. Configurar Base de Datos MySQL
1. En el panel de Hostinger, ve a "Bases de datos MySQL"
2. Crea una nueva base de datos:
   - **Nombre**: mindschool
   - **Usuario**: u721653891
   - **Contraseña**: Sa829801114.
3. Anota los detalles de conexión

### 5. Configurar Variables de Entorno
1. En el administrador de archivos, navega a `public_html/backend/`
2. Edita el archivo `.env`
3. Verifica que tenga estas configuraciones:
   ```
   DB_HOST=localhost
   DB_DATABASE=mindschool
   DB_USERNAME=u721653891
   DB_PASSWORD=Sa829801114.
   APP_URL=https://mindschoo.store
   APP_ENV=production
   APP_DEBUG=false
   ```

### 6. Ejecutar Migraciones (Opcional)
1. En el panel de Hostinger, busca "Terminal SSH"
2. Conéctate a tu servidor
3. Navega a `public_html/backend/`
4. Ejecuta: `php artisan migrate`

### 7. Activar HTTPS
1. En el panel de Hostinger, ve a "SSL"
2. Activa el certificado SSL para tu dominio
3. Esto habilitará https://mindschoo.store

## 🌐 URLs del Sitio

Una vez desplegado, tu sitio estará disponible en:

- **🌐 Sitio Principal**: https://mindschoo.store
- **🎨 Frontend**: https://mindschoo.store/frontend/
- **🔧 Backend**: https://mindschoo.store/backend/public/
- **📊 API**: https://mindschoo.store/backend/public/api

## 📁 Estructura de Archivos

```
public_html/
├── index.php              # Redirección principal
├── .htaccess             # Configuración Apache
├── frontend/             # Aplicación React
│   ├── index.html
│   ├── assets/
│   └── .htaccess
└── backend/              # API Laravel
    ├── public/
    ├── app/
    ├── config/
    └── .env
```

## 🔐 Credenciales del Sistema

### Hostinger
- **Dominio**: mindschoo.store
- **Usuario FTP**: u721653891
- **Contraseña FTP**: Sa829801114.

### Base de Datos
- **Host**: localhost
- **Base de datos**: mindschool
- **Usuario**: u721653891
- **Contraseña**: Sa829801114.

## 🚀 Comandos de Verificación

Una vez desplegado, puedes verificar que todo funciona:

```bash
# Verificar que el sitio carga
curl -I https://mindschoo.store

# Verificar que la API responde
curl https://mindschoo.store/backend/public/api

# Verificar que el frontend carga
curl -I https://mindschoo.store/frontend/
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tu plataforma MindSchool estará completamente funcional en:

**https://mindschoo.store**

### Características Disponibles
- ✅ Panel de estudiantes
- ✅ Panel de profesores
- ✅ Panel de administradores
- ✅ Sistema de cursos
- ✅ Sistema de calificaciones
- ✅ Sistema de asesorías
- ✅ API REST completa
- ✅ Interfaz moderna y responsive

## 📞 Soporte

Si tienes problemas durante el despliegue:
1. Verifica que todos los archivos se extrajeron correctamente
2. Confirma que la base de datos está configurada
3. Asegúrate de que HTTPS esté activado
4. Revisa los logs de error en el panel de Hostinger

---

**¡Tu plataforma educativa MindSchool está lista para revolucionar la educación! 🎓** 