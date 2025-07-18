# Setup y Despliegue Rápido - MindSchool

## 🚀 Instalación y despliegue rápido en Linux

1. Asegúrate de tener instalado:
   - Node.js (v16+ recomendado)
   - npm
   - PHP (8.1+ recomendado)
   - Composer

2. Ve al directorio raíz del proyecto y ejecuta:

   ```bash
   chmod +x Dies_Irae.sh
   ./Dies_Irae.sh
   ```

   Esto instalará dependencias, configurará el backend y frontend, y levantará ambos servidores.

3. Accede a:
   - Frontend: http://localhost:5173
   - Backend/API: http://localhost:8000

4. Para detener los servidores, presiona Ctrl+C en la terminal.

---

### Archivos incluidos en esta carpeta

- `optimize.sh`: Script para optimización del proyecto.
- `Dockerfile` (backend y frontend): Archivos para construir imágenes Docker.
- `README.md`: Este archivo con instrucciones rápidas.

El script principal para iniciar todo es `Dies_Irae.sh` (en el directorio raíz).
