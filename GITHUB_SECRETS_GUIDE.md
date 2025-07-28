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
