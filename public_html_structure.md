# 📁 Estructura correcta para Hostinger

## Estructura recomendada:
```
public_html/
├── index.html              # Archivo principal del frontend
├── assets/                 # Archivos estáticos (CSS, JS, imágenes)
│   ├── css/
│   ├── js/
│   └── images/
├── api/                    # Backend Laravel (si usas API)
│   ├── public/
│   ├── app/
│   └── .env
└── .htaccess              # Configuración de Apache
```

## Problemas comunes que causan 403:

1. **Falta index.html** en la raíz
2. **Permisos incorrectos** de archivos
3. **Configuración .htaccess** incorrecta
4. **Estructura de carpetas** mal organizada 