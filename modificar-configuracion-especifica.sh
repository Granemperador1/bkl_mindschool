#!/bin/bash

# Script para modificar configuraciones específicas
# MindSchool - Modificación de Configuraciones Específicas

echo "🔧 Modificando configuraciones específicas..."
echo "=============================================="

# Configuración
DOMAIN="mindschoo.store"
API_URL="https://mindschoo.store/backend/public"
FRONTEND_URL="https://mindschoo.store/frontend"

# Función para mostrar errores
show_error() {
    echo "❌ Error: $1"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

# 1. Modificar archivo de configuración del frontend
echo "🎨 Modificando configuración del frontend..."

if [ -f "frontend/src/config/environment.js" ]; then
    # Crear backup
    cp frontend/src/config/environment.js frontend/src/config/environment.js.backup
    
    # Modificar URLs
    sed -i 's|http://localhost:8000|https://mindschoo.store/backend/public|g' frontend/src/config/environment.js
    sed -i 's|http://localhost:5173|https://mindschoo.store/frontend|g' frontend/src/config/environment.js
    
    show_success "Configuración del frontend actualizada"
else
    echo "⚠️ Archivo frontend/src/config/environment.js no encontrado"
fi

# 2. Modificar archivo de configuración de axios
echo "🔧 Modificando configuración de axios..."

if [ -f "frontend/src/utils/axiosConfig.js" ]; then
    # Crear backup
    cp frontend/src/utils/axiosConfig.js frontend/src/utils/axiosConfig.js.backup
    
    # Modificar base URL
    sed -i 's|http://localhost:8000|https://mindschoo.store/backend/public|g' frontend/src/utils/axiosConfig.js
    
    show_success "Configuración de axios actualizada"
else
    echo "⚠️ Archivo frontend/src/utils/axiosConfig.js no encontrado"
fi

# 3. Modificar archivo de configuración de servicios
echo "🔧 Modificando configuración de servicios..."

# Buscar archivos de servicios en el frontend
find frontend/src/servicios -name "*.js" -type f | while read file; do
    if [ -f "$file" ]; then
        # Crear backup
        cp "$file" "$file.backup"
        
        # Modificar URLs
        sed -i 's|http://localhost:8000|https://mindschoo.store/backend/public|g' "$file"
        
        echo "✅ Modificado: $file"
    fi
done

# 4. Modificar archivo de configuración de CORS en Laravel
echo "🔧 Modificando configuración CORS..."

if [ -f "backend/config/cors.php" ]; then
    # Crear backup
    cp backend/config/cors.php backend/config/cors.php.backup
    
    # Modificar allowed origins
    sed -i "s/'allowed_origins' => \['http://localhost:5173'\],/'allowed_origins' => ['https://mindschoo.store'],/" backend/config/cors.php
    sed -i "s/'allowed_origins' => \['http://localhost:3000'\],/'allowed_origins' => ['https://mindschoo.store'],/" backend/config/cors.php
    
    show_success "Configuración CORS actualizada"
else
    echo "⚠️ Archivo backend/config/cors.php no encontrado"
fi

# 5. Modificar archivo de configuración de sesión
echo "🔧 Modificando configuración de sesión..."

if [ -f "backend/config/session.php" ]; then
    # Crear backup
    cp backend/config/session.php backend/config/session.php.backup
    
    # Modificar domain
    sed -i "s/'domain' => null,/'domain' => '.mindschoo.store',/" backend/config/session.php
    
    show_success "Configuración de sesión actualizada"
else
    echo "⚠️ Archivo backend/config/session.php no encontrado"
fi

# 6. Modificar archivo de configuración de sanctum
echo "🔧 Modificando configuración de Sanctum..."

if [ -f "backend/config/sanctum.php" ]; then
    # Crear backup
    cp backend/config/sanctum.php backend/config/sanctum.php.backup
    
    # Modificar stateful domains
    sed -i "s/'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf('%s%s', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1', env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''))),/'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1,mindschoo.store')),/" backend/config/sanctum.php
    
    show_success "Configuración de Sanctum actualizada"
else
    echo "⚠️ Archivo backend/config/sanctum.php no encontrado"
fi

# 7. Modificar archivo de configuración de broadcasting
echo "🔧 Modificando configuración de broadcasting..."

if [ -f "backend/config/broadcasting.php" ]; then
    # Crear backup
    cp backend/config/broadcasting.php backend/config/broadcasting.php.backup
    
    # Modificar pusher app_id si existe
    if grep -q "PUSHER_APP_ID" backend/config/broadcasting.php; then
        sed -i 's/PUSHER_APP_ID=.*/PUSHER_APP_ID=your_app_id/' backend/.env
    fi
    
    show_success "Configuración de broadcasting actualizada"
else
    echo "⚠️ Archivo backend/config/broadcasting.php no encontrado"
fi

# 8. Modificar archivo de configuración de mail
echo "🔧 Modificando configuración de mail..."

if [ -f "backend/config/mail.php" ]; then
    # Crear backup
    cp backend/config/mail.php backend/config/mail.php.backup
    
    # Modificar from address
    sed -i "s/'from' => \['address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),'name' => env('MAIL_FROM_NAME', 'Example'),],/'from' => \['address' => env('MAIL_FROM_ADDRESS', 'noreply@mindschoo.store'),'name' => env('MAIL_FROM_NAME', 'MindSchool'),],/" backend/config/mail.php
    
    show_success "Configuración de mail actualizada"
else
    echo "⚠️ Archivo backend/config/mail.php no encontrado"
fi

# 9. Crear archivo de configuración de producción
echo "📝 Creando archivo de configuración de producción..."

cat > public_html/production-config.php << 'EOF'
<?php
// Configuración de producción para MindSchool
return [
    'app' => [
        'name' => 'MindSchool',
        'env' => 'production',
        'debug' => false,
        'url' => 'https://mindschoo.store',
        'timezone' => 'America/Mexico_City',
        'locale' => 'es',
    ],
    'database' => [
        'host' => 'localhost',
        'database' => 'mindschool',
        'username' => 'u721653891',
        'password' => 'Sa829801114.',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],
    'api' => [
        'url' => 'https://mindschoo.store/backend/public',
        'timeout' => 30,
        'retries' => 3,
    ],
    'frontend' => [
        'url' => 'https://mindschoo.store/frontend',
        'assets_url' => 'https://mindschoo.store/frontend/assets',
    ],
    'security' => [
        'cors_origins' => ['https://mindschoo.store'],
        'session_domain' => '.mindschoo.store',
        'csrf_token_lifetime' => 120,
    ],
    'cache' => [
        'enabled' => true,
        'driver' => 'file',
        'ttl' => 3600,
    ],
];
?>
EOF

show_success "Archivo de configuración de producción creado"

# 10. Crear archivo de verificación de configuración
echo "📝 Creando archivo de verificación..."

cat > verificar-configuracion.php << 'EOF'
<?php
// Script de verificación de configuración
echo "🔍 Verificando configuración de MindSchool...\n\n";

// Verificar archivo .env
if (file_exists('backend/.env')) {
    echo "✅ Archivo .env encontrado\n";
    
    $env = file_get_contents('backend/.env');
    
    if (strpos($env, 'DB_HOST=localhost') !== false) {
        echo "✅ DB_HOST configurado correctamente\n";
    } else {
        echo "❌ DB_HOST no configurado correctamente\n";
    }
    
    if (strpos($env, 'DB_DATABASE=mindschool') !== false) {
        echo "✅ DB_DATABASE configurado correctamente\n";
    } else {
        echo "❌ DB_DATABASE no configurado correctamente\n";
    }
    
    if (strpos($env, 'APP_URL=https://mindschoo.store') !== false) {
        echo "✅ APP_URL configurado correctamente\n";
    } else {
        echo "❌ APP_URL no configurado correctamente\n";
    }
    
    if (strpos($env, 'APP_ENV=production') !== false) {
        echo "✅ APP_ENV configurado correctamente\n";
    } else {
        echo "❌ APP_ENV no configurado correctamente\n";
    }
    
} else {
    echo "❌ Archivo .env no encontrado\n";
}

// Verificar archivos de configuración
$config_files = [
    'public_html/.htaccess',
    'public_html/index.php',
    'public_html/frontend/.htaccess',
    'public_html/backend/public/.htaccess',
    'public_html/production-config.php'
];

foreach ($config_files as $file) {
    if (file_exists($file)) {
        echo "✅ $file encontrado\n";
    } else {
        echo "❌ $file no encontrado\n";
    }
}

echo "\n🎉 Verificación completada!\n";
?>
EOF

show_success "Archivo de verificación creado"

echo ""
echo "✅ ¡Configuraciones específicas modificadas exitosamente!"
echo "========================================================"
echo "📦 Archivos modificados:"
echo "   - frontend/src/config/environment.js"
echo "   - frontend/src/utils/axiosConfig.js"
echo "   - frontend/src/servicios/*.js"
echo "   - backend/config/cors.php"
echo "   - backend/config/session.php"
echo "   - backend/config/sanctum.php"
echo "   - backend/config/mail.php"
echo ""
echo "📝 Archivos creados:"
echo "   - public_html/production-config.php"
echo "   - verificar-configuracion.php"
echo ""
echo "🔍 Para verificar la configuración ejecuta:"
echo "   php verificar-configuracion.php"
echo ""
echo "🚀 Tu configuración está lista para producción!" 