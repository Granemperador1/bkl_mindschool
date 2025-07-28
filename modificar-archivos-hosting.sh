#!/bin/bash

# Script para modificar archivos para hosting
# MindSchool - Modificación Automática de Archivos

echo "🔧 Modificando archivos para hosting..."
echo "========================================"

# Configuración
DOMAIN="mindschoo.store"
DB_HOST="localhost"
DB_DATABASE="mindschool"
DB_USERNAME="u721653891"
DB_PASSWORD="Sa829801114."

# Función para mostrar errores
show_error() {
    echo "❌ Error: $1"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

echo "📦 Verificando estructura del proyecto..."

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    show_error "No se encontraron los directorios backend/ y frontend/. Asegúrate de estar en el directorio raíz del proyecto."
fi

show_success "Estructura del proyecto verificada"

# 1. Modificar archivo .env del backend
echo "📝 Modificando archivo .env del backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    show_success "Archivo .env creado desde .env.example"
fi

# Configurar variables para Hostinger
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

show_success "Archivo .env del backend configurado"

cd ..

# 2. Modificar configuración del frontend
echo "🎨 Modificando configuración del frontend..."
cd frontend

# Modificar archivo de configuración de entorno
if [ -f "src/config/environment.js" ]; then
    sed -i 's|http://localhost:8000|https://mindschoo.store/backend/public|g' src/config/environment.js
    show_success "Configuración del frontend actualizada"
else
    echo "⚠️ Archivo src/config/environment.js no encontrado"
fi

cd ..

# 3. Crear archivo index.php principal
echo "📝 Creando archivo index.php principal..."
cat > public_html/index.php << 'EOF'
<?php
// Redirección principal al frontend
header('Location: /frontend/');
exit;
?>
EOF

show_success "Archivo index.php principal creado"

# 4. Crear archivo .htaccess principal
echo "📝 Creando archivo .htaccess principal..."
cat > public_html/.htaccess << 'EOF'
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

show_success "Archivo .htaccess principal creado"

# 5. Crear archivo .htaccess para frontend
echo "📝 Creando archivo .htaccess para frontend..."
mkdir -p public_html/frontend
cat > public_html/frontend/.htaccess << 'EOF'
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

show_success "Archivo .htaccess para frontend creado"

# 6. Crear archivo .htaccess para backend
echo "📝 Creando archivo .htaccess para backend..."
mkdir -p public_html/backend/public
cat > public_html/backend/public/.htaccess << 'EOF'
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

show_success "Archivo .htaccess para backend creado"

# 7. Modificar archivo de configuración de la API
echo "🔧 Modificando configuración de la API..."
if [ -f "backend/config/cors.php" ]; then
    sed -i "s/'allowed_origins' => \['http://localhost:5173'\],/'allowed_origins' => ['https://mindschoo.store'],/" backend/config/cors.php
    show_success "Configuración CORS actualizada"
fi

# 8. Crear archivo de configuración para Hostinger
echo "📝 Creando archivo de configuración para Hostinger..."
cat > public_html/config-hosting.php << 'EOF'
<?php
// Configuración específica para Hostinger
return [
    'database' => [
        'host' => 'localhost',
        'database' => 'mindschool',
        'username' => 'u721653891',
        'password' => 'Sa829801114.',
    ],
    'app_url' => 'https://mindschoo.store',
    'environment' => 'production',
    'debug' => false,
];
?>
EOF

show_success "Archivo de configuración para Hostinger creado"

# 9. Configurar permisos
echo "🔐 Configurando permisos..."
chmod 644 public_html/.htaccess
chmod 644 public_html/index.php
chmod 644 public_html/frontend/.htaccess
chmod 644 public_html/backend/public/.htaccess
chmod -R 755 public_html/backend/storage/
chmod -R 755 public_html/backend/bootstrap/cache/

show_success "Permisos configurados"

# 10. Optimizar Laravel para producción
echo "⚡ Optimizando Laravel para producción..."
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
cd ..

show_success "Laravel optimizado para producción"

# 11. Construir frontend para producción
echo "🏗️ Construyendo frontend para producción..."
cd frontend
npm run build
cd ..

show_success "Frontend construido para producción"

# 12. Copiar archivos construidos
echo "📋 Copiando archivos construidos..."
cp -r frontend/dist/* public_html/frontend/
cp -r backend/* public_html/backend/

show_success "Archivos copiados"

echo ""
echo "✅ ¡Archivos modificados exitosamente!"
echo "========================================"
echo "🌐 URL Principal: https://mindschoo.store"
echo "🎨 Frontend: https://mindschoo.store/frontend/"
echo "🔧 Backend: https://mindschoo.store/backend/public/"
echo "📊 API: https://mindschoo.store/backend/public/api"
echo ""
echo "📦 Archivos modificados:"
echo "   - backend/.env (configurado para Hostinger)"
echo "   - frontend/src/config/environment.js (URLs actualizadas)"
echo "   - public_html/index.php (redirección principal)"
echo "   - public_html/.htaccess (configuración Apache)"
echo "   - public_html/frontend/.htaccess (SPA routing)"
echo "   - public_html/backend/public/.htaccess (Laravel routing)"
echo "   - backend/config/cors.php (CORS configurado)"
echo ""
echo "🚀 Tu sitio está listo para subir a Hostinger!" 