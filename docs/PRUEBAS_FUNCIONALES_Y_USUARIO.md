# Pruebas Funcionales y de Usuario

## 1. Metodología
Se realizaron pruebas manuales y automáticas para validar que todas las funcionalidades principales del sistema MindSchool funcionan correctamente desde la perspectiva de los diferentes roles (profesor y estudiante).

- Pruebas exploratorias en el frontend y backend.
- Pruebas de flujo completo: desde el registro hasta la entrega de tareas y asesorías.
- Validación de roles y permisos.
- Pruebas de integración entre módulos (cursos, tareas, recursos, asesorías).

## 2. Roles probados
- **Profesor**: gestión de cursos, tareas, recursos, lecciones, calificaciones y asesorías.
- **Estudiante**: inscripción a cursos, visualización de recursos, entrega de tareas, reserva de asesorías y acceso a videollamadas.

## 3. Casos de prueba clave
- Inicio de sesión y autenticación para ambos roles.
- Creación, edición y eliminación de cursos por el profesor.
- Inscripción del estudiante a cursos (manual, invitación, código).
- Visualización de cursos inscritos y disponibles por el estudiante.
- Creación, edición, eliminación y entrega de tareas.
- Subida y visualización de recursos e imágenes.
- Reserva y confirmación de asesorías con generación automática de enlace de videollamada.
- Exportación de datos (estudiantes, calificaciones).
- Validación de mensajes de error y éxito.

## 4. Resultados
- Todas las funcionalidades principales fueron validadas y funcionan correctamente.
- Se corrigieron errores detectados durante las pruebas (inscripción, visualización de cursos, validación de fechas, etc.).
- El sistema es usable y robusto para ambos roles.

## 5. Recomendaciones
- Continuar con pruebas de usuario reales en producción.
- Documentar nuevos flujos o módulos que se agreguen.
- Realizar pruebas de carga periódicas si se incrementa el número de usuarios. 