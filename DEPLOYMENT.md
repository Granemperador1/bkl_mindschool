# 🚀 Guía de Despliegue en Hostinger

## 📋 Requisitos previos

- Cuenta en Hostinger con hosting compartido o VPS
- Dominio configurado
- Acceso SSH (recomendado) o FTP
- Base de datos MySQL configurada

## 🔧 Configuración inicial

### 1. Configurar el repositorio local
```bash
git clone https://github.com/Granemperador1/bkl_mindschool.git
cd bkl_mindschool
```

### 2. Configurar variables de entorno
Editar `frontend/src/config/environment.js`:
```javascript
production: {
  API_URL: 'https://tu-dominio.com/api', // Tu dominio real
  BASE_URL: 'https://tu-dominio.com'
}
```

### 3. Configurar base de datos
En el panel de Hostinger:
- Crear base de datos MySQL
- Configurar usuario y contraseña
- Actualizar `.env` en el backend

## 🚀 Despliegue automático

### Opción A: GitHub Actions (Recomendado)

1. **Configurar secrets en GitHub:**
   - Ve a tu repositorio → Settings → Secrets
   - Agregar:
     - `SSH_PRIVATE_KEY`: Tu clave SSH privada
     - `REMOTE_HOST`: Tu servidor Hostinger
     - `REMOTE_USER`: Usuario SSH

2. **El workflow se ejecutará automáticamente** cuando hagas push a main

### Opción B: Despliegue manual

```bash
# Ejecutar script de despliegue
./deploy.sh

# Subir archivo generado a Hostinger
# Extraer en public_html/
```

## 📁 Estructura en Hostinger

```
public_html/
├── index.html          # Frontend construido
├── assets/             # Archivos estáticos
├── api/                # Backend Laravel
│   ├── public/
│   ├── app/
│   └── .env
└── database/           # Configuración BD
```

## 🔄 Flujo de trabajo

### Para hacer cambios:

1. **Desarrollo local:**
```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción de cambios"
git push origin main
```

2. **Despliegue automático:**
- GitHub Actions se ejecuta automáticamente
- Los cambios se suben a Hostinger

3. **Verificar cambios:**
- Visitar tu dominio
- Probar funcionalidades

## 🛠️ Troubleshooting

### Problemas comunes:

1. **Error 500:**
   - Verificar permisos de archivos
   - Revisar logs de error
   - Comprobar configuración .env

2. **API no responde:**
   - Verificar URL en environment.js
   - Comprobar configuración CORS
   - Revisar logs del backend

3. **Base de datos:**
   - Verificar credenciales
   - Comprobar conexión
   - Ejecutar migraciones

## 📞 Soporte

- **Repositorio:** https://github.com/Granemperador1/bkl_mindschool.git
- **Documentación:** Ver carpeta `docs/`
- **Issues:** Crear issue en GitHub para problemas

## 🔗 Enlaces útiles

- [Panel de Hostinger](https://hpanel.hostinger.com)
- [Documentación Laravel](https://laravel.com/docs)
- [Documentación React](https://reactjs.org/docs) 