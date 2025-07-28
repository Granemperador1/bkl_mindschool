#!/bin/bash

echo "🚀 Construyendo proyecto para Hostinger..."

# Limpiar directorio de construcción anterior
rm -rf hosting-build
mkdir hosting-build

# Construir el frontend
echo "📦 Construyendo frontend..."
cd frontend
npm install
npm run build
cd ..

# Copiar archivos construidos
echo "📁 Copiando archivos..."
cp -r frontend/dist/* hosting-build/

# Copiar archivo .htaccess
echo "⚙️ Configurando .htaccess..."
cp public_html/.htaccess hosting-build/

# Crear archivo de configuración para producción
echo "🔧 Configurando para producción..."
cat > hosting-build/config.js << EOF
// Configuración para producción
window.APP_CONFIG = {
  API_URL: 'https://tu-dominio.com/api', // CAMBIAR POR TU DOMINIO REAL
  BASE_URL: 'https://tu-dominio.com',
  ENVIRONMENT: 'production'
};
EOF

# Crear archivo de instrucciones
echo "📋 Creando instrucciones..."
cat > hosting-build/INSTRUCCIONES.txt << EOF
🚀 INSTRUCCIONES PARA SUBIR A HOSTINGER

1. Sube TODOS los archivos de esta carpeta a public_html/
2. Asegúrate de que index.html esté en la raíz de public_html/
3. Verifica que el archivo .htaccess esté presente
4. Actualiza config.js con tu dominio real

📁 Estructura esperada en Hostinger:
public_html/
├── index.html
├── assets/
├── .htaccess
└── config.js

🔧 Si tienes problemas:
- Verifica permisos de archivos (644 para archivos, 755 para carpetas)
- Revisa logs de error en el panel de Hostinger
- Asegúrate de que mod_rewrite esté habilitado

📞 Soporte: https://github.com/Granemperador1/bkl_mindschool.git
EOF

echo "✅ Construcción completada!"
echo ""
echo "📁 Archivos listos en: hosting-build/"
echo "📋 Instrucciones en: hosting-build/INSTRUCCIONES.txt"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Subir archivos de hosting-build/ a public_html/"
echo "2. Actualizar config.js con tu dominio real"
echo "3. Verificar que index.html esté en la raíz"
echo ""
echo "🔗 Tu repositorio: https://github.com/Granemperador1/bkl_mindschool.git" 