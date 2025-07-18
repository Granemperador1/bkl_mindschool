#!/bin/bash

echo "🚀 Optimizando proyecto MindSchool..."

# Limpiar dependencias no utilizadas en el frontend
echo "📦 Limpiando dependencias frontend..."
cd frontend
npm prune
npm audit fix --force

# Limpiar cache de Laravel
echo "🧹 Limpiando cache de Laravel..."
cd ../backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimizar autoloader
echo "⚡ Optimizando autoloader..."
composer dump-autoload --optimize

# Verificar migraciones
echo "🗄️ Verificando migraciones..."
php artisan migrate:status

# Generar documentación de API básica
echo "📚 Generando documentación de API..."
php artisan route:list --path=api > api_routes.txt

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
find . -name "*.log" -delete
find . -name "*.tmp" -delete

# Verificación de salud
echo "🏥 Ejecutando verificación de salud..."
php health_check.php

echo "✅ Optimización completada!"
echo "📋 Resumen:"
echo "   - Dependencias frontend limpiadas"
echo "   - Cache de Laravel limpiado"
echo "   - Autoloader optimizado"
echo "   - Documentación de API generada"
echo "   - Archivos temporales eliminados" 