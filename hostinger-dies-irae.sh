#!/bin/bash

# Script para configurar automáticamente MindSchool en Hostinger
# MindSchool - Configuración Automática Hostinger (Dies Irae)

echo "🚀 Configurando MindSchool en Hostinger (Dies Irae)..."
echo "========================================"

# Función para mostrar errores
show_error() {
    echo "❌ Error: $1"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    show_error "No se encontraron los directorios backend/ y frontend/. Asegúrate de estar en el directorio raíz del proyecto."
fi

echo "📦 Verificando estructura del proyecto..."

# Verificar estructura de directorios
if [ ! -d "public_html" ]; then
    show_error "No se encontró el directorio public_html/. Ejecuta primero build-for-hosting.sh"
fi

show_success "Estructura del proyecto verificada"

# Configurar backend para Hostinger
echo "🔧 Configurando backend para Hostinger..."

cd backend

# Verificar si las dependencias de Laravel están instaladas
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependencias de Laravel..."
    composer install --no-dev --optimize-autoloader
    if [ $? -ne 0 ]; then
        show_error "Error al instalar dependencias de Laravel"
    fi
    show_success "Dependencias de Laravel instaladas"
else
    show_success "Dependencias de Laravel ya instaladas"
fi

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    
    # Configurar variables específicas para Hostinger
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=localhost/' .env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=mindschool/' .env
    sed -i 's/DB_USERNAME=root/DB_USERNAME=u721653891/' .env
    sed -i 's/DB_PASSWORD=/DB_PASSWORD=Sa829801114./' .env
    
    # Configurar APP_URL para Hostinger
    sed -i 's|APP_URL=http://localhost|APP_URL=https://mindschoo.store|' .env
    
    # Configurar APP_ENV para producción
    sed -i 's/APP_ENV=local/APP_ENV=production/' .env
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
    
    # Generar clave de aplicación
    php artisan key:generate
    show_success "Archivo .env creado y configurado"
else
    show_success "Archivo .env ya existe"
fi

# Limpiar caché de Laravel
echo "🧹 Limpiando caché de Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
show_success "Caché de Laravel limpiado"

# Optimizar para producción
echo "⚡ Optimizando para producción..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
show_success "Laravel optimizado para producción"

# Verificar permisos de directorios
echo "🔐 Configurando permisos..."
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
show_success "Permisos configurados"

cd ..

# Configurar frontend para Hostinger
echo "🎨 Configurando frontend para Hostinger..."

cd frontend

# Verificar si las dependencias del frontend están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    if [ $? -ne 0 ]; then
        show_error "Error al instalar dependencias del frontend"
    fi
    show_success "Dependencias del frontend instaladas"
else
    show_success "Dependencias del frontend ya instaladas"
fi

# Construir para producción
echo "🏗️ Construyendo frontend para producción..."
npm run build
if [ $? -ne 0 ]; then
    show_error "Error al construir el frontend"
fi
show_success "Frontend construido para producción"

cd ..

# Configurar archivos para hosting
echo "📁 Preparando archivos para hosting..."

# Crear directorio public_html si no existe
if [ ! -d "public_html" ]; then
    mkdir -p public_html
fi

# Copiar archivos del frontend construido
echo "📋 Copiando archivos del frontend..."
cp -r frontend/dist/* public_html/

# Copiar archivos del backend
echo "📋 Copiando archivos del backend..."
cp -r backend/* public_html/backend/

# Crear archivo index.php principal
echo "📝 Creando archivo index.php principal..."
cat > public_html/index.php << 'EOF'
<?php
// Redirección principal al frontend
header('Location: /frontend/');
exit;
?>
EOF

# Crear .htaccess principal
echo "📝 Creando .htaccess principal..."
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

# Crear .htaccess para frontend
echo "📝 Creando .htaccess para frontend..."
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

# Crear .htaccess para backend
echo "📝 Creando .htaccess para backend..."
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

# Configurar permisos
echo "🔐 Configurando permisos finales..."
chmod 644 public_html/.htaccess
chmod 644 public_html/index.php
chmod 644 public_html/frontend/.htaccess
chmod 644 public_html/backend/public/.htaccess
chmod -R 755 public_html/backend/storage/
chmod -R 755 public_html/backend/bootstrap/cache/

show_success "Archivos preparados para hosting"

# Crear archivo de configuración para Hostinger
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

echo ""
echo "✅ Configuración completada exitosamente (Dies Irae Hostinger)!"
echo "========================================"
echo "🌐 URL Principal: https://mindschoo.store"
echo "🎨 Frontend: https://mindschoo.store/frontend/"
echo "🔧 Backend: https://mindschoo.store/backend/public/"
echo "📊 API: https://mindschoo.store/backend/public/api"
echo ""
echo "📦 Archivos listos en: public_html/"
echo "🚀 Sube el contenido de public_html/ a tu hosting"
echo ""
echo "💡 Próximos pasos:"
echo "   1. Subir archivos a Hostinger"
echo "   2. Configurar base de datos MySQL"
echo "   3. Ejecutar migraciones"
echo "   4. Activar HTTPS"
echo "" 