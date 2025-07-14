#!/bin/bash

# Script para iniciar automáticamente los servidores de frontend y backend
# MindSchool - Servidor Automático

echo "🚀 Iniciando servidores de MindSchool..."
echo "========================================"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C para limpiar procesos
trap cleanup SIGINT

# Verificar si las dependencias están instaladas
echo "📦 Verificando dependencias..."

# Verificar Node.js y npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar PHP y Composer
if ! command -v php &> /dev/null; then
    echo "❌ PHP no está instalado. Por favor instala PHP primero."
    exit 1
fi

if ! command -v composer &> /dev/null; then
    echo "❌ Composer no está instalado. Por favor instala Composer primero."
    exit 1
fi

echo "✅ Dependencias verificadas"

# Navegar al directorio del backend (Laravel)
echo "🔧 Configurando backend..."
cd backend

# Verificar si las dependencias de Laravel están instaladas
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependencias de Laravel..."
    composer install
fi

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    php artisan key:generate
fi

# Ejecutar migraciones si es necesario
echo "🗄️ Verificando base de datos..."
php artisan migrate --force

# Iniciar servidor de Laravel en segundo plano
echo "🚀 Iniciando servidor de Laravel (Backend) en puerto 8000..."
php artisan serve --host=0.0.0.0 --port=8000 &
BACKEND_PID=$!

# Esperar un momento para que el backend se inicie
sleep 3

# Navegar al directorio del frontend
echo "🎨 Configurando frontend..."
cd ../frontend

# Verificar si las dependencias del frontend están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

# Iniciar servidor de Vite en segundo plano
echo "🚀 Iniciando servidor de Vite (Frontend) en puerto 5173..."
npm run dev &
FRONTEND_PID=$!

# Esperar un momento para que ambos servidores se inicien
sleep 5

echo ""
echo "✅ Servidores iniciados exitosamente!"
echo "========================================"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/api"
echo ""
echo "💡 Presiona Ctrl+C para detener ambos servidores"
echo ""

# Mantener el script ejecutándose
wait 