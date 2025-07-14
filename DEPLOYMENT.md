# 🚀 Guía de Deployment - MindSchool Beta

## 📋 Prerrequisitos

### Servidor de Producción
- **Sistema Operativo**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **PHP**: 8.1+ con extensiones requeridas
- **Node.js**: 18+ y npm
- **Base de Datos**: MySQL 8.0+ o PostgreSQL 13+
- **Web Server**: Nginx o Apache
- **SSL Certificate**: Let's Encrypt o certificado comercial

### Extensiones PHP Requeridas
```bash
php-bcmath
php-curl
php-gd
php-mbstring
php-mysql
php-xml
php-zip
php-redis
php-intl
```

## 🔧 Configuración del Servidor

### 1. Instalar Dependencias del Sistema
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx mysql-server php8.1-fpm php8.1-mysql php8.1-xml php8.1-curl php8.1-gd php8.1-mbstring php8.1-zip php8.1-bcmath php8.1-redis php8.1-intl composer nodejs npm git

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx mysql-server php-fpm php-mysql php-xml php-curl php-gd php-mbstring php-zip php-bcmath php-redis php-intl composer nodejs npm git
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE mindschool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mindschool_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON mindschool.* TO 'mindschool_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configurar Nginx
```nginx
# /etc/nginx/sites-available/mindschool
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    root /var/www/mindschool/backend/public;
    index index.php index.html;

    # Frontend (React build)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

## 📦 Deployment del Código

### 1. Clonar Repositorio
```bash
cd /var/www
sudo git clone https://github.com/Granemperador1/miprojecto_mindschool.git mindschool
sudo chown -R www-data:www-data mindschool
cd mindschool
```

### 2. Configurar Backend
```bash
cd backend

# Instalar dependencias PHP
composer install --no-dev --optimize-autoloader

# Configurar variables de entorno
cp .env.example .env
nano .env

# Configuración de producción en .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mindschool
DB_USERNAME=mindschool_user
DB_PASSWORD=tu_password_seguro

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones
php artisan migrate --force

# Ejecutar seeders (opcional)
php artisan db:seed --force

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Configurar permisos
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. Configurar Frontend
```bash
cd ../frontend

# Instalar dependencias
npm ci --only=production

# Configurar variables de entorno
echo "VITE_API_URL=https://tu-dominio.com/api" > .env.production

# Construir para producción
npm run build

# Copiar build a directorio público
sudo cp -r dist/* /var/www/mindschool/backend/public/
```

### 4. Configurar SSL (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Configuración de Seguridad

### 1. Firewall
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Configurar Redis
```bash
# Editar configuración de Redis
sudo nano /etc/redis/redis.conf

# Cambiar:
bind 127.0.0.1
requirepass tu_password_redis_seguro

# Reiniciar Redis
sudo systemctl restart redis
```

### 3. Configurar Supervisor (para queues)
```bash
# Instalar Supervisor
sudo apt install supervisor

# Crear configuración
sudo nano /etc/supervisor/conf.d/mindschool.conf

[program:mindschool-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/mindschool/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/mindschool/backend/storage/logs/worker.log
stopwaitsecs=3600
```

## 📊 Monitoreo y Logs

### 1. Configurar Logrotate
```bash
sudo nano /etc/logrotate.d/mindschool

/var/www/mindschool/backend/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 2. Configurar Monitoreo
```bash
# Instalar herramientas de monitoreo
sudo apt install htop iotop nethogs

# Configurar alertas de disco
sudo nano /etc/cron.daily/disk-check
#!/bin/bash
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is ${DISK_USAGE}%" | mail -s "Disk Alert" admin@tu-dominio.com
fi
```

## 🚀 Comandos de Deployment

### Script de Deployment Automático
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deployment de MindSchool..."

# Pull latest changes
git pull origin main

# Backend deployment
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend deployment
cd ../frontend
npm ci --only=production
npm run build
cp -r dist/* ../backend/public/

# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm
sudo supervisorctl restart mindschool-worker:*

echo "✅ Deployment completado exitosamente!"
```

### Comandos Útiles
```bash
# Ver logs en tiempo real
sudo tail -f /var/www/mindschool/backend/storage/logs/laravel.log

# Verificar estado de servicios
sudo systemctl status nginx php8.1-fpm redis

# Reiniciar servicios
sudo systemctl restart nginx php8.1-fpm redis

# Verificar permisos
sudo chown -R www-data:www-data /var/www/mindschool
sudo chmod -R 755 /var/www/mindschool

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error 500 - Permisos**
```bash
sudo chown -R www-data:www-data /var/www/mindschool
sudo chmod -R 755 /var/www/mindschool
sudo chmod -R 775 /var/www/mindschool/backend/storage
```

2. **Error de Base de Datos**
```bash
# Verificar conexión
php artisan tinker
DB::connection()->getPdo();

# Verificar migraciones
php artisan migrate:status
```

3. **Error de SSL**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew
```

4. **Error de Redis**
```bash
# Verificar estado
sudo systemctl status redis

# Verificar conexión
redis-cli ping
```

## 📞 Soporte

Para reportar problemas o solicitar soporte:
- **Email**: soporte@mindschool.com
- **Issues**: [GitHub Issues](https://github.com/Granemperador1/miprojecto_mindschool/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/Granemperador1/miprojecto_mindschool/wiki)

---

**Versión**: Beta v1.0.0  
**Última actualización**: Enero 2024  
**Compatibilidad**: PHP 8.1+, Node.js 18+, MySQL 8.0+ 