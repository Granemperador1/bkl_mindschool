# 🔄 DIAGRAMAS DE FLUJO - SISTEMA MINDSCHOOL

## 📊 DIAGRAMA PRINCIPAL DEL SISTEMA

```mermaid
graph TB
    subgraph "FRONTEND (React)"
        A[Usuario accede a la aplicación]
        B[Página de Login]
        C[Verificación de token]
        D[Redirección por rol]
    end

    subgraph "BACKEND (Laravel API)"
        E[AuthController]
        F[Middleware de autenticación]
        G[Controladores específicos]
        H[Validación de datos]
    end

    subgraph "BASE DE DATOS"
        I[(MySQL - Datos principales)]
        J[(MongoDB - Multimedia)]
    end

    A --> B
    B --> E
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J

    C --> D
    D --> G

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style E fill:#e8f5e8
    style I fill:#f3e5f5
    style J fill:#fff8e1
```

---

## 🔐 FLUJO DE AUTENTICACIÓN

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as AuthContext
    participant B as Backend API
    participant D as Database

    U->>F: Accede a /login
    F->>U: Muestra formulario de login

    U->>F: Ingresa email y password
    F->>A: Envía credenciales
    A->>B: POST /api/login
    B->>D: Valida credenciales
    D-->>B: Datos del usuario + roles
    B-->>A: Token Sanctum + user data
    A->>F: Almacena token en localStorage
    A->>F: Actualiza estado de autenticación
    F->>U: Redirecciona según rol

    Note over U,F: Si rol = profesor
    F->>U: Redirecciona a /profesor/dashboard

    Note over U,F: Si rol = estudiante
    F->>U: Redirecciona a /estudiante/dashboard

    Note over U,F: Si rol = admin
    F->>U: Redirecciona a /admin/dashboard
```

---

## 👨‍🏫 FLUJO DEL PROFESOR

```mermaid
graph TD
    A[Profesor hace login] --> B[Accede al Dashboard]
    B --> C[Ve tarjeta de bienvenida con mascota]
    C --> D[Selecciona cuatrimestre]

    D --> E{¿Qué cuatrimestre?}
    E -->|Cuarto| F[Cuarto Cuatrimestre]
    E -->|Quinto| G[Quinto Cuatrimestre]
    E -->|Sexto| H[Sexto Cuatrimestre]

    F --> I[Ve materias del cuatrimestre]
    G --> I
    H --> I

    I --> J[Selecciona materia]
    J --> K[Ve grupos de la materia]
    K --> L[Selecciona grupo]

    L --> M{¿Qué acción?}
    M -->|Ver Alumnos| N[Lista de alumnos del grupo]
    M -->|Gestionar Tareas| O[Crear/Editar tareas]
    M -->|Calificar| P[Revisar entregas y calificar]
    M -->|Ver Progreso| Q[Estadísticas del grupo]

    N --> R[Ver perfil de cada alumno]
    O --> S[Asignar tareas con fechas]
    P --> T[Asignar calificaciones]
    Q --> U[Ver gráficos de progreso]

    R --> V[Comunicarse con alumno]
    S --> W[Notificar a estudiantes]
    T --> X[Generar reportes]
    U --> Y[Identificar alumnos en riesgo]

    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style I fill:#e1f5fe
    style L fill:#fff8e1
```

---

## 👨‍🎓 FLUJO DEL ESTUDIANTE

```mermaid
graph TD
    A[Estudiante hace login] --> B[Accede al Dashboard]
    B --> C[Ve tareas pendientes]
    B --> D[Ve materias inscritas]

    C --> E[Filtra tareas por materia/estado]
    E --> F[Selecciona tarea]
    F --> G[Ve detalles de la tarea]
    G --> H[Descarga materiales]
    H --> I[Entrega la tarea]
    I --> J[Recibe confirmación]

    D --> K[Selecciona materia]
    K --> L[Ve lecciones disponibles]
    L --> M[Accede a lección]
    M --> N[Consume contenido multimedia]
    N --> O[Video/Imagen/Audio]
    N --> P[Documentos PDF]
    N --> Q[Presentaciones]

    B --> R[Ve calificaciones]
    R --> S[Historial de notas]
    S --> T[Progreso por materia]

    B --> U[Actualiza perfil]
    U --> V[Cambia contraseña]
    U --> W[Actualiza información personal]

    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style F fill:#e1f5fe
    style K fill:#fff8e1
```

---

## 👨‍💼 FLUJO DEL ADMINISTRADOR

```mermaid
graph TD
    A[Admin hace login] --> B[Accede al Dashboard]
    B --> C[Ve estadísticas generales]

    C --> D[Usuarios activos]
    C --> E[Cursos más populares]
    C --> F[Tasa de finalización]

    B --> G[Gestión de Usuarios]
    G --> H[Crear nuevo usuario]
    G --> I[Editar usuario existente]
    G --> J[Asignar roles]
    G --> K[Desactivar usuario]

    B --> L[Gestión de Cursos]
    L --> M[Crear nuevo curso]
    L --> N[Editar curso existente]
    L --> O[Asignar instructor]
    L --> P[Configurar materias]

    B --> Q[Gestión de Inscripciones]
    Q --> R[Ver todas las inscripciones]
    Q --> S[Gestionar inscripciones]
    Q --> T[Generar reportes]

    B --> U[Reportes y Estadísticas]
    U --> V[Reporte de usuarios]
    U --> W[Reporte de cursos]
    U --> X[Reporte de rendimiento]
    U --> Y[Exportar datos]

    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style G fill:#fff3e0
    style L fill:#f3e5f5
    style Q fill:#e1f5fe
    style U fill:#fff8e1
```

---

## 🔄 FLUJO DE CREACIÓN DE CURSO

```mermaid
sequenceDiagram
    participant P as Profesor
    participant F as Frontend
    participant B as Backend API
    participant D as Database

    P->>F: Hace clic en "Crear Curso"
    F->>P: Muestra modal de creación
    P->>F: Completa formulario del curso
    F->>B: POST /api/cursos
    B->>B: Valida datos del curso
    B->>D: Guarda curso en BD
    D-->>B: Curso creado exitosamente
    B-->>F: Respuesta con datos del curso
    F->>P: Muestra confirmación
    F->>P: Actualiza lista de cursos

    P->>F: Agrega lecciones al curso
    F->>B: POST /api/lecciones
    B->>D: Guarda lección
    D-->>B: Lección creada
    B-->>F: Confirmación

    P->>F: Sube contenido multimedia
    F->>B: POST /api/multimedia
    B->>D: Guarda en MongoDB
    D-->>B: Multimedia guardada
    B-->>F: URL del contenido
    F->>P: Muestra contenido subido
```

---

## 📚 FLUJO DE INSCRIPCIÓN A CURSO

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant F as Frontend
    participant B as Backend API
    participant D as Database
    participant P as Profesor (Notificación)

    E->>F: Ve lista de cursos disponibles
    F->>B: GET /api/cursos
    B->>D: Consulta cursos activos
    D-->>B: Lista de cursos
    B-->>F: Cursos disponibles
    F->>E: Muestra cursos

    E->>F: Selecciona curso
    F->>E: Muestra detalles del curso
    E->>F: Hace clic en "Inscribirse"
    F->>B: POST /api/inscripciones
    B->>B: Valida disponibilidad
    B->>D: Crea inscripción
    D-->>B: Inscripción creada

    B->>P: Envía notificación de nueva inscripción
    B-->>F: Confirmación de inscripción
    F->>E: Muestra confirmación
    F->>E: Actualiza dashboard del estudiante
```

---

## 📝 FLUJO DE GESTIÓN DE TAREAS

```mermaid
graph TD
    A[Profesor crea tarea] --> B[Define título y descripción]
    B --> C[Establece fecha de entrega]
    C --> D[Asigna puntos máximos]
    D --> E[Adjunta archivos de referencia]
    E --> F[Publica la tarea]

    F --> G[Estudiantes reciben notificación]
    G --> H[Estudiante ve tarea en dashboard]
    H --> I[Descarga materiales]
    I --> J[Completa la tarea]
    J --> K[Sube archivo de entrega]
    K --> L[Envía la tarea]

    L --> M[Profesor recibe notificación]
    M --> N[Profesor revisa entrega]
    N --> O[Asigna calificación]
    O --> P[Agrega comentarios]
    P --> Q[Publica calificación]

    Q --> R[Estudiante ve calificación]
    R --> S[Estudiante ve comentarios]
    S --> T[Actualiza progreso académico]

    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style L fill:#f3e5f5
    style Q fill:#e1f5fe
    style T fill:#fff8e1
```

---

## 🔄 FLUJO DE DATOS EN TIEMPO REAL

```mermaid
graph LR
    subgraph "FRONTEND"
        A[Componente React]
        B[Estado Local]
        C[Context API]
    end

    subgraph "BACKEND"
        D[API Endpoints]
        E[Validación]
        F[Base de Datos]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F

    F --> E
    E --> D
    D --> C
    C --> B
    B --> A

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#f3e5f5
    style E fill:#fff8e1
    style F fill:#e0f2f1
```

---

## 🛡️ FLUJO DE SEGURIDAD

```mermaid
graph TD
    A[Petición HTTP] --> B{¿Tiene token?}
    B -->|No| C[Redirigir a login]
    B -->|Sí| D[Validar token Sanctum]

    D --> E{¿Token válido?}
    E -->|No| C
    E -->|Sí| F[Obtener usuario]

    F --> G{¿Ruta protegida?}
    G -->|No| H[Acceso permitido]
    G -->|Sí| I[Verificar rol]

    I --> J{¿Rol correcto?}
    J -->|No| K[Error 403 - Forbidden]
    J -->|Sí| L[Ejecutar controlador]

    L --> M[Validar datos de entrada]
    M --> N{¿Datos válidos?}
    N -->|No| O[Error 422 - Validation]
    N -->|Sí| P[Procesar petición]

    P --> Q[Acceder a base de datos]
    Q --> R[Retornar respuesta]

    style A fill:#e1f5fe
    style C fill:#ffebee
    style H fill:#e8f5e8
    style K fill:#fff3e0
    style O fill:#fff3e0
    style R fill:#e8f5e8
```

---

## 📊 ARQUITECTURA DE COMPONENTES

```mermaid
graph TB
    subgraph "LAYER PRESENTATION"
        A[App.jsx]
        B[AuthContext]
        C[Navbar]
        D[RedireccionPorRol]
    end

    subgraph "LAYER PAGES"
        E[Login]
        F[ProfesorDashboard]
        G[EstudianteDashboard]
        H[AdminDashboard]
    end

    subgraph "LAYER COMPONENTS"
        I[LoadingSpinner]
        J[CuatrimestreSelector]
        K[MateriasGrid]
        L[GruposMenu]
        M[TareaModal]
    end

    subgraph "LAYER HOOKS"
        N[useApi]
        O[useAuth]
    end

    subgraph "LAYER BRANDING"
        P[Logo]
        Q[Mascota]
        R[branding.js]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> H

    F --> J
    F --> K
    F --> L
    F --> M

    B --> O
    F --> N
    G --> N

    C --> P
    F --> Q

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style E fill:#e8f5e8
    style F fill:#f3e5f5
    style G fill:#fff8e1
    style H fill:#e0f2f1
```

---

_Estos diagramas representan los flujos principales del sistema MindSchool, mostrando la interacción entre usuarios, frontend, backend y base de datos de manera clara y visual._
