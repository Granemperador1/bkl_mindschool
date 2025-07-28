#!/bin/bash

# Script para conectar GitHub con Hostinger
# MindSchool - Conexión Automática Git-Hosting

echo "🔗 Conectando GitHub con Hostinger..."
echo "========================================"

# Configuración
GITHUB_REPO="https://github.com/Granemperador1/el_chido.git"
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

echo "📦 Verificando configuración..."

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    show_error "No se encontró el repositorio Git. Asegúrate de estar en el directorio del proyecto."
fi

# Verificar que el repositorio remoto existe
if ! git remote get-url el_chido > /dev/null 2>&1; then
    show_error "No se encontró el repositorio remoto 'el_chido'. Verifica la configuración."
fi

show_success "Repositorio Git verificado"

# Verificar dependencias
echo "🔧 Verificando dependencias..."

# Verificar lftp (para FTP automático)
if ! command -v lftp &> /dev/null; then
    echo "📦 Instalando lftp..."
    sudo apt-get update && sudo apt-get install -y lftp
    if [ $? -ne 0 ]; then
        show_error "No se pudo instalar lftp. Instálalo manualmente: sudo apt-get install lftp"
    fi
fi

show_success "Dependencias verificadas"

# Crear script de despliegue automático
echo "📝 Creando script de despliegue automático..."

cat > deploy-to-hostinger.sh << 'EOF'
#!/bin/bash

# Script de despliegue automático a Hostinger
# Se ejecuta automáticamente cuando se hace push a GitHub

echo "🚀 Desplegando a Hostinger..."

# Configuración
FTP_HOST="mindschoo.store"
FTP_USER="u721653891"
FTP_PASS="Sa829801114."
FTP_PORT="21"

# Construir para producción
echo "🏗️ Construyendo para producción..."

# Configurar backend
cd backend
composer install --no-dev --optimize-autoloader

# Configurar .env para producción
if [ ! -f ".env" ]; then
    cp .env.example .env
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=localhost/' .env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=mindschool/' .env
    sed -i 's/DB_USERNAME=root/DB_USERNAME=u721653891/' .env
    sed -i 's/DB_PASSWORD=/DB_PASSWORD=Sa829801114./' .env
    sed -i 's|APP_URL=http://localhost|APP_URL=https://mindschoo.store|' .env
    sed -i 's/APP_ENV=local/APP_ENV=production/' .env
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
    php artisan key:generate
fi

# Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

cd ..

# Construir frontend
cd frontend
npm install
npm run build
cd ..

# Preparar archivos para hosting
echo "📁 Preparando archivos para hosting..."

# Crear directorio temporal
rm -rf temp_deploy
mkdir temp_deploy

# Copiar archivos del frontend
cp -r frontend/dist/* temp_deploy/

# Copiar archivos del backend
cp -r backend/* temp_deploy/backend/

# Crear archivos de configuración
cat > temp_deploy/index.php << 'PHP_EOF'
<?php
// Redirección principal al frontend
header('Location: /frontend/');
exit;
?>
PHP_EOF

cat > temp_deploy/.htaccess << 'HTACCESS_EOF'
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

# Subir archivos via FTP
echo "📤 Subiendo archivos a Hostinger..."

lftp -c "
set ssl:verify-certificate no;
open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST:$FTP_PORT;
mirror --reverse --delete temp_deploy/ /public_html/;
bye;
"

if [ $? -eq 0 ]; then
    echo "✅ Despliegue completado exitosamente!"
    echo "🌐 Sitio web: https://mindschoo.store"
else
    echo "❌ Error en el despliegue"
    exit 1
fi

# Limpiar archivos temporales
rm -rf temp_deploy

echo "🎉 ¡Despliegue completado!"
EOF

chmod +x deploy-to-hostinger.sh
show_success "Script de despliegue creado"

# Crear workflow de GitHub Actions
echo "📝 Creando workflow de GitHub Actions..."

mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'YAML_EOF'
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql, dom, filter, gd, iconv, json, mbstring, pdo, xml
        coverage: none
        
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install Composer dependencies
      run: |
        cd backend
        composer install --no-dev --optimize-autoloader
        
    - name: Install npm dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Build frontend
      run: |
        cd frontend
        npm run build
        
    - name: Configure Laravel
      run: |
        cd backend
        cp .env.example .env
        sed -i 's/DB_HOST=127.0.0.1/DB_HOST=localhost/' .env
        sed -i 's/DB_DATABASE=laravel/DB_DATABASE=mindschool/' .env
        sed -i 's/DB_USERNAME=root/DB_USERNAME=${{ secrets.DB_USERNAME }}/' .env
        sed -i 's/DB_PASSWORD=/DB_PASSWORD=${{ secrets.DB_PASSWORD }}/' .env
        sed -i 's|APP_URL=http://localhost|APP_URL=https://mindschoo.store|' .env
        sed -i 's/APP_ENV=local/APP_ENV=production/' .env
        sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
        php artisan key:generate
        
    - name: Optimize Laravel
      run: |
        cd backend
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        
    - name: Deploy to Hostinger
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        server-dir: /public_html/
        local-dir: ./public_html/
        exclude: |
          **/.git*
          **/.git*/**
          **/node_modules/**
          **/vendor/**
          **/storage/logs/**
          **/storage/framework/cache/**
          **/storage/framework/sessions/**
          **/storage/framework/views/**
YAML_EOF

show_success "Workflow de GitHub Actions creado"

# Crear archivo de configuración para GitHub Secrets
echo "📝 Creando guía de configuración..."

cat > GITHUB_SECRETS_GUIDE.md << 'EOF'
# 🔐 Configuración de GitHub Secrets

Para que el despliegue automático funcione, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

## 📋 Secrets Requeridos

1. **FTP_SERVER**: `mindschoo.store`
2. **FTP_USERNAME**: `u721653891`
3. **FTP_PASSWORD**: `Sa829801114.`
4. **DB_USERNAME**: `u721653891`
5. **DB_PASSWORD**: `Sa829801114.`

## 🔧 Cómo Configurar

1. Ve a tu repositorio en GitHub: https://github.com/Granemperador1/el_chido
2. Haz clic en "Settings" (Configuración)
3. En el menú lateral, haz clic en "Secrets and variables" → "Actions"
4. Haz clic en "New repository secret"
5. Agrega cada uno de los secrets mencionados arriba

## 🚀 Despliegue Automático

Una vez configurados los secrets, cada vez que hagas push a la rama `main`, 
el sitio se desplegará automáticamente a Hostinger.

## 📊 Monitoreo

Puedes ver el estado de los despliegues en:
https://github.com/Granemperador1/el_chido/actions
EOF

show_success "Guía de configuración creada"

# Crear script de configuración manual
echo "📝 Creando script de configuración manual..."

cat > configurar-despliegue-manual.sh << 'EOF'
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
EOF

chmod +x configurar-despliegue-manual.sh
show_success "Script de despliegue manual creado"

echo ""
echo "✅ Conexión Git-Hosting configurada exitosamente!"
echo "========================================"
echo "🔗 Repositorio: https://github.com/Granemperador1/el_chido"
echo "🌐 Hosting: https://mindschoo.store"
echo "📊 FTP: ftp://mindschoo.store"
echo ""
echo "📋 Scripts creados:"
echo "   - deploy-to-hostinger.sh (Despliegue automático)"
echo "   - configurar-despliegue-manual.sh (Despliegue manual)"
echo "   - .github/workflows/deploy.yml (GitHub Actions)"
echo ""
echo "💡 Próximos pasos:"
echo "   1. Configurar GitHub Secrets (ver GITHUB_SECRETS_GUIDE.md)"
echo "   2. Hacer push a main para activar despliegue automático"
echo "   3. Verificar el sitio web en https://mindschoo.store"
echo "" 