# 🗄️ DIAGRAMA DE BASE DE DATOS - MINDSCHOOL

## 📊 ESQUEMA COMPLETO DE LA BASE DE DATOS

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email UK
        string password
        string avatar_url
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        bigint id PK
        string name UK
        string guard_name
        timestamp created_at
        timestamp updated_at
    }

    MODEL_HAS_ROLES {
        bigint role_id FK
        string model_type
        bigint model_id
    }

    CURSOS {
        bigint id PK
        string titulo
        text descripcion
        int duracion
        string nivel
        decimal precio
        string estado
        bigint instructor_id FK
        string imagen_url
        timestamp created_at
        timestamp updated_at
    }

    INSCRIPCIONES {
        bigint id PK
        bigint user_id FK
        bigint curso_id FK
        string estado
        timestamp fecha_inscripcion
        int progreso
        timestamp created_at
        timestamp updated_at
    }

    LECCIONES {
        bigint id PK
        string titulo
        text descripcion
        longtext contenido
        int duracion
        int orden
        bigint curso_id FK
        string estado
        timestamp created_at
        timestamp updated_at
    }

    TAREAS {
        bigint id PK
        string titulo
        text descripcion
        timestamp fecha_asignacion
        timestamp fecha_entrega
        string tipo
        string archivo_url
        bigint curso_id FK
        bigint leccion_id FK
        string estado
        int puntos_maximos
        timestamp created_at
        timestamp updated_at
    }

    ENTREGAS_TAREAS {
        bigint id PK
        bigint tarea_id FK
        bigint estudiante_id FK
        string archivo_url
        text comentarios
        decimal calificacion
        text comentarios_profesor
        timestamp fecha_entrega
        string estado
        timestamp created_at
        timestamp updated_at
    }

    MULTIMEDIA {
        bigint id PK
        string titulo
        text descripcion
        string tipo
        string url
        bigint leccion_id FK
        int orden
        string estado
        timestamp created_at
        timestamp updated_at
    }

    MENSAJES {
        bigint id PK
        bigint remitente_id FK
        bigint destinatario_id FK
        string asunto
        text contenido
        string tipo
        string estado
        timestamp fecha_envio
        timestamp fecha_lectura
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        string id PK
        string type
        string notifiable_type
        bigint notifiable_id
        text data
        timestamp read_at
        timestamp created_at
        timestamp updated_at
    }

    PERSONAL_ACCESS_TOKENS {
        bigint id PK
        string tokenable_type
        bigint tokenable_id
        string name
        string token UK
        text abilities
        timestamp last_used_at
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    MIGRATIONS {
        int id PK
        string migration
        int batch
    }

    PASSWORD_RESET_TOKENS {
        string email PK
        string token
        timestamp created_at
    }

    FAILED_JOBS {
        bigint id PK
        string uuid UK
        text connection
        text queue
        longtext payload
        longtext exception
        timestamp failed_at
    }

    CACHE {
        string key PK
        mediumtext value
        int expiration
    }

    CACHE_LOCKS {
        string key PK
        string owner
        int expiration
    }

    JOBS {
        bigint id PK
        string queue
        longtext payload
        tinyint attempts
        tinyint reserved
        int reserved_at
        int available_at
        int created_at
    }

    BATCHES {
        string id PK
        string name
        int total_jobs
        int pending_jobs
        int failed_jobs
        text failed_job_ids
        mediumtext options
        int cancelled_at
        int created_at
        int finished_at
    }

    JOB_BATCHES {
        string batch_id FK
        bigint job_id FK
    }

    SESSIONS {
        string id PK
        bigint user_id FK
        string ip_address
        text user_agent
        longtext payload
        int last_activity
    }

    %% RELACIONES PRINCIPALES
    USERS ||--o{ CURSOS : "instructor_id"
    USERS ||--o{ INSCRIPCIONES : "user_id"
    USERS ||--o{ ENTREGAS_TAREAS : "estudiante_id"
    USERS ||--o{ MENSAJES : "remitente_id"
    USERS ||--o{ MENSAJES : "destinatario_id"
    USERS ||--o{ NOTIFICATIONS : "notifiable_id"
    USERS ||--o{ PERSONAL_ACCESS_TOKENS : "tokenable_id"
    USERS ||--o{ SESSIONS : "user_id"

    ROLES ||--o{ MODEL_HAS_ROLES : "role_id"
    USERS ||--o{ MODEL_HAS_ROLES : "model_id"

    CURSOS ||--o{ INSCRIPCIONES : "curso_id"
    CURSOS ||--o{ LECCIONES : "curso_id"
    CURSOS ||--o{ TAREAS : "curso_id"

    LECCIONES ||--o{ TAREAS : "leccion_id"
    LECCIONES ||--o{ MULTIMEDIA : "leccion_id"

    TAREAS ||--o{ ENTREGAS_TAREAS : "tarea_id"

    %% RELACIONES DE SISTEMA
    JOBS ||--o{ JOB_BATCHES : "job_id"
    BATCHES ||--o{ JOB_BATCHES : "batch_id"
```

---

## 🔗 RELACIONES DETALLADAS

### 1. Relaciones de Usuario

```mermaid
graph TD
    A[USERS] --> B[ROLES]
    A --> C[CURSOS - como instructor]
    A --> D[INSCRIPCIONES - como estudiante]
    A --> E[ENTREGAS_TAREAS - como estudiante]
    A --> F[MENSAJES - como remitente]
    A --> G[MENSAJES - como destinatario]
    A --> H[NOTIFICATIONS]
    A --> I[PERSONAL_ACCESS_TOKENS]
    A --> J[SESSIONS]

    B --> K[MODEL_HAS_ROLES]
    A --> K

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#f3e5f5
    style E fill:#fff8e1
```

### 2. Relaciones de Curso

```mermaid
graph TD
    A[CURSOS] --> B[USERS - instructor]
    A --> C[INSCRIPCIONES]
    A --> D[LECCIONES]
    A --> E[TAREAS]

    C --> F[MULTIMEDIA]
    C --> E

    E --> G[ENTREGAS_TAREAS]
    G --> H[USERS - estudiantes]

    C --> I[USERS - estudiantes inscritos]

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#f3e5f5
    style E fill:#fff8e1
```

### 3. Flujo de Datos Académicos

```mermaid
graph LR
    A[USERS - Profesor] --> B[CURSOS]
    B --> C[LECCIONES]
    C --> D[MULTIMEDIA]
    C --> E[TAREAS]

    F[USERS - Estudiante] --> G[INSCRIPCIONES]
    G --> B
    E --> H[ENTREGAS_TAREAS]
    H --> F

    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#e1f5fe
    style F fill:#fff8e1
    style G fill:#e0f2f1
    style H fill:#fce4ec
```

---

## 📋 DESCRIPCIÓN DE TABLAS

### Tablas Principales

#### 1. **USERS** - Usuarios del Sistema

- **Propósito**: Almacena información de todos los usuarios (admin, profesores, estudiantes)
- **Campos clave**: `id`, `name`, `email`, `password`, `avatar_url`
- **Relaciones**: Múltiples roles, cursos como instructor, inscripciones como estudiante

#### 2. **CURSOS** - Cursos/Materias

- **Propósito**: Información de los cursos disponibles
- **Campos clave**: `titulo`, `descripcion`, `instructor_id`, `estado`
- **Relaciones**: Instructor, inscripciones, lecciones, tareas

#### 3. **INSCRIPCIONES** - Relación Estudiante-Curso

- **Propósito**: Registra qué estudiantes están inscritos en qué cursos
- **Campos clave**: `user_id`, `curso_id`, `estado`, `progreso`
- **Relaciones**: Estudiante, curso

#### 4. **LECCIONES** - Contenido del Curso

- **Propósito**: Lecciones individuales dentro de un curso
- **Campos clave**: `titulo`, `contenido`, `curso_id`, `orden`
- **Relaciones**: Curso, multimedia, tareas

#### 5. **TAREAS** - Actividades Asignadas

- **Propósito**: Tareas y evaluaciones asignadas a los estudiantes
- **Campos clave**: `titulo`, `fecha_entrega`, `puntos_maximos`, `curso_id`
- **Relaciones**: Curso, lección, entregas

#### 6. **ENTREGAS_TAREAS** - Trabajos de Estudiantes

- **Propósito**: Entregas realizadas por los estudiantes
- **Campos clave**: `tarea_id`, `estudiante_id`, `calificacion`, `fecha_entrega`
- **Relaciones**: Tarea, estudiante

### Tablas de Sistema

#### 7. **ROLES** - Roles de Usuario

- **Propósito**: Define los roles disponibles (admin, profesor, estudiante)
- **Campos clave**: `name`, `guard_name`

#### 8. **MULTIMEDIA** - Contenido Multimedia

- **Propósito**: Archivos multimedia asociados a lecciones
- **Campos clave**: `titulo`, `tipo`, `url`, `leccion_id`

#### 9. **MENSAJES** - Sistema de Mensajería

- **Propósito**: Comunicación entre usuarios
- **Campos clave**: `remitente_id`, `destinatario_id`, `asunto`, `contenido`

---

## 🔄 FLUJO DE DATOS EN LA BASE DE DATOS

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as Auth
    participant C as Cursos
    participant I as Inscripciones
    participant L as Lecciones
    participant T as Tareas
    participant E as Entregas

    U->>A: Registro/Login
    A->>A: Crear/Validar token

    U->>C: Crear curso (si es profesor)
    C->>C: Guardar curso

    U->>I: Inscribirse a curso (si es estudiante)
    I->>I: Crear inscripción

    U->>L: Crear lección (profesor)
    L->>L: Guardar lección

    U->>T: Crear tarea (profesor)
    T->>T: Guardar tarea

    U->>E: Entregar tarea (estudiante)
    E->>E: Guardar entrega

    U->>E: Calificar entrega (profesor)
    E->>E: Actualizar calificación
```

---

## 📊 ÍNDICES Y OPTIMIZACIÓN

### Índices Principales

```sql
-- Usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Cursos
CREATE INDEX idx_cursos_instructor ON cursos(instructor_id);
CREATE INDEX idx_cursos_estado ON cursos(estado);

-- Inscripciones
CREATE INDEX idx_inscripciones_user ON inscripciones(user_id);
CREATE INDEX idx_inscripciones_curso ON inscripciones(curso_id);
CREATE INDEX idx_inscripciones_fecha ON inscripciones(fecha_inscripcion);

-- Tareas
CREATE INDEX idx_tareas_curso ON tareas(curso_id);
CREATE INDEX idx_tareas_fecha_entrega ON tareas(fecha_entrega);

-- Entregas
CREATE INDEX idx_entregas_tarea ON entregas_tareas(tarea_id);
CREATE INDEX idx_entregas_estudiante ON entregas_tareas(estudiante_id);
```

### Consultas Optimizadas

```sql
-- Cursos de un profesor con conteo de estudiantes
SELECT c.*, COUNT(i.id) as total_estudiantes
FROM cursos c
LEFT JOIN inscripciones i ON c.id = i.curso_id
WHERE c.instructor_id = ?
GROUP BY c.id;

-- Tareas pendientes de un estudiante
SELECT t.*, c.titulo as curso_nombre
FROM tareas t
JOIN cursos c ON t.curso_id = c.id
JOIN inscripciones i ON c.id = i.curso_id
WHERE i.user_id = ? AND t.fecha_entrega > NOW()
ORDER BY t.fecha_entrega ASC;
```

---

## 🗃️ MONGODB - ALMACENAMIENTO MULTIMEDIA

### Colecciones MongoDB

```javascript
// multimedia_recursos
{
  _id: ObjectId,
  tipo: "video|imagen|audio|documento",
  descripcion: String,
  url: String,
  tags: [String],
  miniatura: String,
  metadatos: {
    duracion: Number,
    tamaño: Number,
    formato: String
  },
  created_at: Date,
  updated_at: Date
}

// usuarios_mongo (para datos adicionales)
{
  _id: ObjectId,
  user_id: Number, // Referencia a MySQL
  preferencias: {
    tema: String,
    notificaciones: Boolean,
    idioma: String
  },
  actividad: [{
    fecha: Date,
    accion: String,
    detalles: Object
  }]
}
```

---

_Este diagrama representa la estructura completa de la base de datos del sistema MindSchool, mostrando todas las relaciones entre entidades y el flujo de datos académicos._
