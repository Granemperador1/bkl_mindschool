#!/bin/bash

# Script para iniciar el backend y frontend en modo LAN
# Autor: AI MindSchool

# 1. Detectar la IP local
IP_LOCAL=$(ip -4 addr show | grep inet | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1 | head -n1)

if [ -z "$IP_LOCAL" ]; then
  echo "No se pudo detectar la IP local. Por favor, verifica tu conexión de red."
  exit 1
fi

# 2. Iniciar el backend (Laravel)
echo "Iniciando backend en 0.0.0.0:8000..."
cd backend || { echo "No se encontró la carpeta backend"; exit 1; }
# Instalar dependencias si es necesario
test -d vendor || composer install
# Migrar base de datos si es necesario
# php artisan migrate --seed # Descomenta si quieres migrar automáticamente
php artisan serve --host=0.0.0.0 --port=8000 &
BACKEND_PID=$!
cd ..

# 3. Iniciar el frontend (Vite/React)
echo "Iniciando frontend en modo LAN..."
cd frontend || { echo "No se encontró la carpeta frontend"; exit 1; }
# Instalar dependencias si es necesario
test -d node_modules || npm install
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

# 4. Mostrar URLs de acceso
echo "\n========================================="
echo "¡Servidor LAN iniciado con éxito!"
echo "Accede desde cualquier dispositivo en tu red local:"
echo "  Frontend: http://$IP_LOCAL:5173"
echo "  Backend:  http://$IP_LOCAL:8000"
echo "\nRecuerda:"
echo "- Si el frontend no puede comunicarse con el backend, revisa la configuración de CORS en backend/config/cors.php."
echo "- Asegúrate de que la variable VITE_API_URL en frontend apunte a http://$IP_LOCAL:8000/api. Puedes crear o editar frontend/.env así:"
echo "    VITE_API_URL=http://$IP_LOCAL:8000/api"
echo "- Si usas firewall, abre los puertos 8000 y 5173 para la LAN."
echo "- Para detener los servidores, usa: kill $BACKEND_PID $FRONTEND_PID"
echo "\nRecomendación profesional:"
echo "- Para ambientes de producción, usa servidores como Nginx/Apache para PHP y un build estático para React."
echo "- No uses este script para exponer tu app a internet sin medidas de seguridad."
echo "- Mantén tus dependencias actualizadas y realiza backups periódicos de tu base de datos."
echo "========================================="

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID 