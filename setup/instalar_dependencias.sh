#!/bin/bash

set -e

# Cambia esta ruta por la ruta absoluta de tu proyecto si es necesario
PROYECTO_DIR="/home/saul/Espiritu_vengativo/miprojecto_mindschool_beta"

echo "=============================================="
echo "  Instalador de dependencias para MindSchool  "
echo "=============================================="

# Actualizar repositorios
sudo apt update && sudo apt upgrade -y

# 1. Instalar utilidades básicas
echo "Instalando utilidades básicas..."
sudo apt install -y git curl unzip build-essential software-properties-common

# 2. Instalar Node.js (última LTS) y npm
echo "Instalando Node.js y npm..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Instalar PHP y extensiones necesarias
echo "Instalando PHP y extensiones..."
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php php-cli php-fpm php-mysql php-xml php-mbstring php-curl php-zip php-gd php-bcmath php-json php-redis php-mongodb

# 4. Instalar Composer (gestor de dependencias PHP)
echo "Instalando Composer..."
cd ~
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php

# 5. Instalar MySQL Server
echo "Instalando MySQL Server..."
sudo apt install -y mysql-server

# 6. Instalar MongoDB (opcional, si se usa en el proyecto)
echo "Instalando MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 7. Instalar dependencias del backend
echo "Instalando dependencias de backend (composer)..."
cd "$PROYECTO_DIR/backend"
composer install

# 8. Instalar dependencias del frontend
echo "Instalando dependencias de frontend (npm)..."
cd "$PROYECTO_DIR/frontend"
npm install

cd "$PROYECTO_DIR"
echo "=============================================="
echo "  ¡Dependencias instaladas correctamente!     "
echo "=============================================="
echo "Recuerda configurar tu .env y la base de datos." 