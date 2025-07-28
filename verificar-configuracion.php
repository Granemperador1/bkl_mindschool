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
