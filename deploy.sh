#!/bin/bash

echo "🚀 Iniciando despliegue a Hostinger..."

# Construir el frontend
echo "📦 Construyendo frontend..."
cd frontend
npm install
npm run build
cd ..

# Crear archivo de configuración para producción
echo "⚙️ Configurando para producción..."
cp .env.example .env.production

# Comprimir archivos para subir
echo "📦 Comprimiendo archivos..."
tar -czf mindschool-deploy.tar.gz \
  frontend/dist/ \
  backend/ \
  .env.production \
  setup/ \
  docs/

echo "✅ Archivo de despliegue creado: mindschool-deploy.tar.gz"
echo ""
echo "📋 Pasos para subir a Hostinger:"
echo "1. Sube el archivo mindschool-deploy.tar.gz a tu hosting"
echo "2. Extrae los archivos en public_html/"
echo "3. Configura la base de datos en el panel de Hostinger"
echo "4. Actualiza las variables de entorno en environment.js"
echo ""
echo "🔗 URL del repositorio: https://github.com/Granemperador1/bkl_mindschool.git" 