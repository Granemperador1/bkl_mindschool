@echo off
echo Iniciando servidores de MindSchool...
echo ========================================

REM Verificar Node.js
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado. Instala Node.js y vuelve a intentar.
    pause
    exit /b 1
)

REM Verificar PHP
where php >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: PHP no esta instalado. Instala PHP y vuelve a intentar.
    pause
    exit /b 1
)

REM Verificar Composer
where composer >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Composer no esta instalado. Instala Composer y vuelve a intentar.
    pause
    exit /b 1
)

echo Dependencias verificadas

REM Iniciar backend
cd backend
if not exist "vendor" (
    echo Instalando dependencias de Laravel...
    composer install
)
if not exist ".env" (
    echo Creando archivo .env...
    copy .env.example .env
    php artisan key:generate
)
echo Ejecutando migraciones...
php artisan migrate --force

echo Iniciando servidor de Laravel en puerto 8000...
start "Laravel Backend" cmd /c "php artisan serve --host=127.0.0.1 --port=8000"
cd ..

REM Esperar unos segundos para que el backend inicie
timeout /t 3 >nul

REM Iniciar frontend
cd frontend
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    npm install
)
echo Iniciando servidor de Vite (Frontend) en puerto 5173...
start "Vite Frontend" cmd /c "npm run dev"
cd ..

REM Esperar unos segundos para que el frontend inicie
timeout /t 5 >nul

REM Abrir navegador
start http://localhost:5173

echo ========================================
echo Servidores iniciados. Puedes usar MindSchool en tu navegador.
echo ========================================
pause