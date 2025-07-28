#!/bin/bash

# Script para configurar despliegue manual a Hostinger

echo "🔧 Configurando despliegue manual..."

# Configuración
FTP_HOST="mindschoo.store"
FTP_USER="u721653891"
FTP_PASS="Sa829801114."

# Verificar si lftp está instalado
if ! command -v lftp &> /dev/null; then
    echo "📦 Instalando lftp..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

# Crear directorio de despliegue
mkdir -p deploy_temp

# Copiar archivos del frontend
echo "📋 Copiando archivos del frontend..."
cp -r frontend/dist/* deploy_temp/

# Copiar archivos del backend
echo "📋 Copiando archivos del backend..."
cp -r backend/* deploy_temp/backend/

# Crear archivos de configuración
echo "📝 Creando archivos de configuración..."

cat > deploy_temp/index.php << 'PHP_EOF'
<?php
// Redirección principal al frontend
header('Location: /frontend/');
exit;
?>
PHP_EOF

cat > deploy_temp/.htaccess << 'HTACCESS_EOF'
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
HTACCESS_EOF

# Subir archivos
echo "📤 Subiendo archivos a Hostinger..."

lftp -c "
set ssl:verify-certificate no;
open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST;
mirror --reverse --delete deploy_temp/ /public_html/;
bye;
"

if [ $? -eq 0 ]; then
    echo "✅ Despliegue manual completado!"
    echo "🌐 Sitio web: https://mindschoo.store"
else
    echo "❌ Error en el despliegue manual"
    exit 1
fi

# Limpiar
rm -rf deploy_temp

echo "🎉 ¡Despliegue manual completado!"
