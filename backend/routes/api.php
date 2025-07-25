<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CursoController;
use App\Http\Controllers\Api\LeccionController;
use App\Http\Controllers\Api\InscripcionController;
use App\Http\Controllers\Api\MultimediaController;
use App\Http\Controllers\Api\MensajeController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\ProfesorController;
use App\Http\Controllers\Api\EstudianteController;
use App\Http\Controllers\Api\TareaController;
use App\Http\Controllers\Api\EntregaTareaController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CalificacionController;
use App\Http\Controllers\Api\ExamenController;
use App\Http\Controllers\Api\AsistenciaController;
use App\Http\Controllers\Api\RecursoController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\ContactoPublicoController;
use App\Http\Controllers\Api\AsesoriaController;

// Rutas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas públicas de consulta
Route::apiResource('cursos', CursoController::class)->only(['index', 'show']);
Route::get('/cursos/{curso}/lecciones', [LeccionController::class, 'cursoLecciones']);
Route::get('/cursos/{curso}/multimedia', [MultimediaController::class, 'cursoMultimedia']);

// Ruta pública para listar profesores (para asesorías)
use App\Models\User;
Route::get('/profesores', function () {
    return User::role('profesor')->select('id', 'name', 'email')->get();
});

// Ruta pública para contacto
Route::post('/contacto', [ContactoPublicoController::class, 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    // Forzar recarga de roles desde la base de datos
    $user->syncRoles($user->roles()->pluck('name')->toArray());
    $user->load('roles');
    $user->roles = $user->roles->pluck('name')->toArray();
    return response()->json($user);
});

// Rutas protegidas (requieren login)
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Notificaciones
    Route::get('/notificaciones', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notificaciones/{id}/leer', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/notificaciones/leertodas', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::delete('/notificaciones/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'destroy']);
    
    // Cursos (todas las operaciones, incluyendo index y show)
    Route::apiResource('cursos', CursoController::class);
    
    // Lecciones (todas las operaciones)
    Route::apiResource('lecciones', LeccionController::class);
    Route::get('/cursos/{curso}/lecciones', [LeccionController::class, 'cursoLecciones']);
    
    // Tareas (todas las operaciones)
    Route::apiResource('tareas', TareaController::class);
    Route::get('/cursos/{curso}/tareas', [TareaController::class, 'cursoTareas']);
    Route::get('/lecciones/{leccion}/tareas', [TareaController::class, 'leccionTareas']);
    
    // Entregas de tareas
    Route::apiResource('entregas-tareas', EntregaTareaController::class);
    Route::put('/entregas-tareas/{entrega}/calificar', [EntregaTareaController::class, 'calificar']);
    Route::get('/tareas/{tarea}/entregas', [EntregaTareaController::class, 'tareaEntregas']);
    Route::get('/estudiantes/{estudiante}/entregas', [EntregaTareaController::class, 'estudianteEntregas']);
    
    // Calificaciones
    Route::middleware('role:profesor|admin,web')->group(function () {
        Route::apiResource('calificaciones', CalificacionController::class);
        Route::get('/cursos/{curso}/calificaciones', [CalificacionController::class, 'calificacionesCurso']);
        Route::get('/estudiantes/{estudiante}/cursos/{curso}/promedio', [CalificacionController::class, 'promedioEstudiante']);
        Route::post('/calificaciones/publicar', [CalificacionController::class, 'publicarCalificaciones']);
    });
    // Consulta de calificaciones del estudiante (permitido para el propio estudiante)
    Route::get('/estudiantes/{estudiante}/calificaciones', [CalificacionController::class, 'calificacionesEstudiante']);
    
    // Exámenes
    Route::middleware('role:profesor|admin,web')->group(function () {
        Route::apiResource('examenes', ExamenController::class);
        Route::get('/cursos/{curso}/examenes', [ExamenController::class, 'cursoExamenes']);
        Route::get('/examenes-activos', [ExamenController::class, 'examenesActivos']);
    });
    
    // Asistencias
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('asistencias', AsistenciaController::class);
        Route::get('/cursos/{curso}/asistencias', [AsistenciaController::class, 'cursoAsistencias']);
        Route::get('/estudiantes/{estudiante}/asistencias', [AsistenciaController::class, 'estudianteAsistencias']);
        Route::get('/cursos/{curso}/asistencias/estadisticas', [AsistenciaController::class, 'estadisticasCurso']);
    });
    
    // Recursos
    Route::apiResource('recursos', RecursoController::class);
    Route::get('/cursos/{curso}/recursos', [RecursoController::class, 'cursoRecursos']);
    Route::get('/recursos/tipo/{tipo}', [RecursoController::class, 'recursosPorTipo']);
    Route::get('/recursos/buscar', [RecursoController::class, 'buscar']);
    
    // Inscripciones
    Route::apiResource('inscripciones', InscripcionController::class);
    Route::get('/cursos/{curso}/inscripciones', [InscripcionController::class, 'cursoInscripciones']);
    Route::get('/inscripciones/pagadas', [\App\Http\Controllers\Api\InscripcionController::class, 'pagadas']);
    
    // Multimedia (todas las operaciones)
    Route::apiResource('multimedia', MultimediaController::class);
    Route::get('/lecciones/{leccion}/multimedia', [MultimediaController::class, 'leccionMultimedia']);
    
    // Mensajes
    Route::get('/mensajes/enviados', [MensajeController::class, 'enviados']);
    Route::get('/mensajes/recibidos', [MensajeController::class, 'recibidos']);
    Route::put('/mensajes/{mensaje}/leer', [MensajeController::class, 'marcarComoLeido']);
    Route::apiResource('mensajes', MensajeController::class);
    
    // Rutas específicas para administradores
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    });
    
    // Contactos para mensajería (accesible para usuarios autenticados)
    Route::get('/usuarios/contactos', [UsuarioController::class, 'contactos']);
    
    // Gestión de usuarios (solo admin)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('usuarios', UsuarioController::class);
        Route::put('/usuarios/{usuario}/rol', [UsuarioController::class, 'updateRole']);
    });
    
    // Rutas específicas para profesores
    Route::middleware('role:profesor')->prefix('profesor')->group(function () {
        Route::get('/dashboard', [ProfesorController::class, 'dashboard']);
        Route::get('/cursos', [ProfesorController::class, 'misCursos']);
        Route::get('/cursos/{curso}/estudiantes', [ProfesorController::class, 'estudiantesCurso']);
        Route::get('/cursos/{curso}/lecciones', [ProfesorController::class, 'leccionesCurso']);
        Route::get('/cursos/{curso}/tareas', [ProfesorController::class, 'tareasCurso']);
        Route::post('/lecciones', [ProfesorController::class, 'crearLeccion']);
        Route::post('/tareas', [ProfesorController::class, 'crearTarea']);
        Route::put('/inscripciones/{inscripcion}/progreso', [ProfesorController::class, 'actualizarProgreso']);
        Route::get('/cursos/{curso}/estadisticas', [ProfesorController::class, 'estadisticasCurso']);
        Route::get('/tareas/{tarea}/entregas', [ProfesorController::class, 'entregasTarea']);
        Route::put('/entregas/{entrega}/calificar', [ProfesorController::class, 'calificarEntrega']);
        // NUEVO: Endpoint para racha de entregas de alumnos
        Route::get('/cursos/{curso}/racha-alumnos', [ProfesorController::class, 'rachaAlumnosCurso']);
    });

    // Rutas específicas para estudiantes
    Route::middleware('role:estudiante')->prefix('estudiante')->group(function () {
        Route::get('/dashboard', [EstudianteController::class, 'dashboard']);
        Route::get('/materias', [EstudianteController::class, 'misMaterias']);
        Route::get('/tareas-pendientes', [EstudianteController::class, 'tareasPendientes']);
        Route::get('/tareas/{tarea}', [EstudianteController::class, 'detalleTarea']);
        Route::post('/tareas/{tarea}/entregar', [EstudianteController::class, 'entregarTarea']);
        Route::get('/calificaciones', [EstudianteController::class, 'calificaciones']);
        Route::get('/perfil', [EstudianteController::class, 'perfil']);
        Route::put('/perfil', [EstudianteController::class, 'actualizarPerfil']);
        Route::put('/cambiar-contrasena', [EstudianteController::class, 'cambiarContrasena']);
    });

    // Gestión de alumnos e invitaciones en cursos
    Route::post('/cursos/{curso}/invitar', [CursoController::class, 'invitarAlumnoPorCorreo']);
    Route::post('/cursos/{curso}/generar-codigo-invitacion', [CursoController::class, 'generarCodigoInvitacion']);
    Route::post('/cursos/{curso}/agregar-alumno', [CursoController::class, 'agregarAlumnoManual']);
    Route::post('/cursos/{curso}/inscribirse', [CursoController::class, 'inscribirConCodigo']);
    // Pagos de cursos
    Route::post('/cursos/{curso}/pagar', [\App\Http\Controllers\Api\PagoController::class, 'pagar']);
    // Pagos/ingresos del profesor
    Route::get('/profesor/pagos', [\App\Http\Controllers\Api\PagoController::class, 'pagosProfesor']);

    // Rutas para gestión de asesorías
    Route::prefix('asesorias')->group(function () {
        Route::get('/disponibilidad-profesor/{profesor_id}', [\App\Http\Controllers\Api\AsesoriaController::class, 'getDisponibilidadProfesor']);
        Route::post('/definir-disponibilidad', [\App\Http\Controllers\Api\AsesoriaController::class, 'definirDisponibilidad']);
        Route::post('/reservar', [\App\Http\Controllers\Api\AsesoriaController::class, 'reservarAsesoria']);
        Route::get('/mis-asesorias', [\App\Http\Controllers\Api\AsesoriaController::class, 'misAsesorias']);
        Route::post('/cancelar/{asesoria_id}', [\App\Http\Controllers\Api\AsesoriaController::class, 'cancelarAsesoria']);
        Route::post('/reprogramar/{asesoria_id}', [\App\Http\Controllers\Api\AsesoriaController::class, 'reprogramarAsesoria']);
    });
    // Ruta para eliminar bloque de disponibilidad (fuera del prefijo 'asesorias' para evitar doble prefijo)
    Route::delete('/asesorias/disponibilidad/{id}', [\App\Http\Controllers\Api\AsesoriaController::class, 'eliminarDisponibilidad']);

    // Perfil de usuario
    Route::get('/perfil', [\App\Http\Controllers\Api\UsuarioController::class, 'perfil']);
    Route::put('/perfil', [\App\Http\Controllers\Api\UsuarioController::class, 'actualizarPerfil']);
    Route::put('/perfil/password', [\App\Http\Controllers\Api\UsuarioController::class, 'cambiarPassword']);
    Route::put('/perfil/configuracion', [\App\Http\Controllers\Api\UsuarioController::class, 'actualizarConfiguracion']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/analytics/dashboard', [\App\Http\Controllers\Api\AnalyticsController::class, 'dashboard']);
});

// Endpoint de simulación de pago solo en entorno local/testing
if (app()->environment(['local', 'testing'])) {
    Route::post('/pagos/simular', [\App\Http\Controllers\Api\PagoController::class, 'simularPago']);
}

Route::middleware(['auth:sanctum', 'role:profesor'])->group(function () {
    Route::get('/profesor/cursos/{curso}/exportar-estudiantes', [ProfesorController::class, 'exportarEstudiantesCurso']);
    Route::get('/profesor/cursos/{curso}/exportar-calificaciones', [ProfesorController::class, 'exportarCalificacionesCurso']);
});
