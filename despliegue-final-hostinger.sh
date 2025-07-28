#!/bin/bash

# Script Final de Despliegue a Hostinger
# MindSchool - Despliegue Completo y Funcional

echo "🚀 Despliegue Final a Hostinger - MindSchool"
echo "=============================================="

# Configuración
FTP_HOST="mindschoo.store"
FTP_USER="u721653891"
FTP_PASS="Sa829801114."
FTP_PORT="21"

# Función para mostrar errores
show_error() {
    echo "❌ Error: $1"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

# Función para mostrar información
show_info() {
    echo "ℹ️ $1"
}

echo "📦 Verificando estructura del proyecto..."

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    show_error "No se encontraron los directorios backend/ y frontend/. Asegúrate de estar en el directorio raíz del proyecto."
fi

show_success "Estructura del proyecto verificada"

# Limpiar directorios temporales anteriores
echo "🧹 Limpiando directorios temporales..."
rm -rf deploy_temp
rm -rf temp_deploy
show_success "Limpieza completada"

# Crear directorio de despliegue
echo "📁 Creando directorio de despliegue..."
mkdir -p deploy_temp
mkdir -p deploy_temp/backend
show_success "Directorio de despliegue creado"

# Construir frontend para producción
echo "🎨 Construyendo frontend para producción..."
cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    if [ $? -ne 0 ]; then
        show_error "Error al instalar dependencias del frontend"
    fi
fi

# Construir para producción
npm run build
if [ $? -ne 0 ]; then
    show_error "Error al construir el frontend"
fi

show_success "Frontend construido exitosamente"

# Copiar archivos del frontend construido
echo "📋 Copiando archivos del frontend..."
cp -r dist/* ../deploy_temp/
cd ..

# Configurar backend para producción
echo "🔧 Configurando backend para producción..."
cd backend

# Verificar si vendor existe
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependencias del backend..."
    composer install --no-dev --optimize-autoloader
    if [ $? -ne 0 ]; then
        show_error "Error al instalar dependencias del backend"
    fi
fi

# Configurar archivo .env para producción
echo "📝 Configurando archivo .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

# Configurar variables específicas para Hostinger
sed -i 's/DB_HOST=127.0.0.1/DB_HOST=localhost/' .env
sed -i 's/DB_DATABASE=laravel/DB_DATABASE=mindschool/' .env
sed -i 's/DB_USERNAME=root/DB_USERNAME=u721653891/' .env
sed -i 's/DB_PASSWORD=/DB_PASSWORD=Sa829801114./' .env
sed -i 's|APP_URL=http://localhost|APP_URL=https://mindschoo.store|' .env
sed -i 's/APP_ENV=local/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env

# Generar clave de aplicación si no existe
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate
fi

show_success "Backend configurado exitosamente"

# Optimizar Laravel para producción
echo "⚡ Optimizando Laravel para producción..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
show_success "Laravel optimizado"

# Copiar archivos del backend
echo "📋 Copiando archivos del backend..."
cp -r * ../deploy_temp/backend/
cd ..

# Crear archivos de configuración para hosting
echo "📝 Creando archivos de configuración..."

# Archivo index.php principal
cat > deploy_temp/index.php << 'EOF'
<?php
// Redirección principal al frontend
header('Location: /frontend/');
exit;
?>
EOF

# Archivo .htaccess principal
cat > deploy_temp/.htaccess << 'EOF'
RewriteEngine On

# Headers de seguridad
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Caché para archivos estáticos (1 año)
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# Redirección principal al frontend
RewriteRule ^$ /frontend/ [L,R=301]

# Permitir acceso a archivos estáticos
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirección para API
RewriteRule ^api/(.*)$ /backend/public/index.php [L]

# Redirección para frontend
RewriteRule ^(.*)$ /frontend/index.html [L]
EOF

# Archivo .htaccess para frontend
cat > deploy_temp/frontend/.htaccess << 'EOF'
RewriteEngine On

# Headers de seguridad para frontend
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Caché para archivos estáticos (1 año)
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# SPA routing - redirigir todo a index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

# Archivo .htaccess para backend
cat > deploy_temp/backend/public/.htaccess << 'EOF'
RewriteEngine On

# Headers de seguridad para backend
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Redirigir todo a index.php
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
EOF

# Configurar permisos
echo "🔐 Configurando permisos..."
chmod 644 deploy_temp/.htaccess
chmod 644 deploy_temp/index.php
chmod 644 deploy_temp/frontend/.htaccess
chmod 644 deploy_temp/backend/public/.htaccess
chmod -R 755 deploy_temp/backend/storage/
chmod -R 755 deploy_temp/backend/bootstrap/cache/

show_success "Archivos de configuración creados"

# Verificar si lftp está instalado
echo "🔧 Verificando herramientas de FTP..."
if ! command -v lftp &> /dev/null; then
    echo "📦 Instalando lftp..."
    sudo apt-get update && sudo apt-get install -y lftp
    if [ $? -ne 0 ]; then
        show_error "No se pudo instalar lftp. Instálalo manualmente: sudo apt-get install lftp"
    fi
fi

show_success "Herramientas FTP verificadas"

# Subir archivos a Hostinger
echo "📤 Subiendo archivos a Hostinger..."
echo "🌐 Servidor: $FTP_HOST"
echo "👤 Usuario: $FTP_USER"

lftp -c "
set ssl:verify-certificate no;
set ftp:ssl-allow no;
open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST:$FTP_PORT;
mirror --reverse --delete deploy_temp/ /public_html/;
bye;
"

if [ $? -eq 0 ]; then
    show_success "Despliegue completado exitosamente!"
    echo ""
    echo "🎉 ¡MindSchool desplegado en Hostinger!"
    echo "========================================"
    echo "🌐 Sitio web: https://mindschoo.store"
    echo "🎨 Frontend: https://mindschoo.store/frontend/"
    echo "🔧 Backend: https://mindschoo.store/backend/public/"
    echo "📊 API: https://mindschoo.store/backend/public/api"
    echo ""
    echo "💡 Próximos pasos:"
    echo "   1. Configurar base de datos MySQL en Hostinger"
    echo "   2. Ejecutar migraciones: php artisan migrate"
    echo "   3. Activar HTTPS en el panel de Hostinger"
    echo "   4. Probar funcionalidades del sitio"
    echo ""
else
    show_error "Error en el despliegue FTP. Verifica las credenciales y conexión."
fi

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
rm -rf deploy_temp
show_success "Limpieza completada"

echo ""
echo "✅ ¡Despliegue finalizado!"
echo "🚀 Tu sitio MindSchool está listo en https://mindschoo.store" 