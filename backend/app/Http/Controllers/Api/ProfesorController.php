<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Inscripcion;
use App\Models\User;
use App\Models\Leccion;
use App\Models\Multimedia;
use App\Models\Tarea;
use App\Models\EntregaTarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CalificacionesExport;

class ProfesorController extends Controller
{
    /**
     * Obtener dashboard del profesor
     */
    public function dashboard(Request $request)
    {
        $profesorId = $request->user()->id;
        
        // Cursos del profesor
        $cursos = Curso::where('instructor_id', $profesorId)
            ->withCount(['inscripciones', 'lecciones'])
            ->get();
        
        // Estadísticas generales
        $totalEstudiantes = Inscripcion::whereHas('curso', function($query) use ($profesorId) {
            $query->where('instructor_id', $profesorId);
        })->count();
        
        $totalCursos = $cursos->count();
        $totalLecciones = $cursos->sum('lecciones_count');
        
        return response()->json([
            'data' => [
                'cursos' => $cursos,
                'estadisticas' => [
                    'total_estudiantes' => $totalEstudiantes,
                    'total_cursos' => $totalCursos,
                    'total_lecciones' => $totalLecciones
                ]
            ]
        ]);
    }

    /**
     * Obtener cursos del profesor
     */
    public function misCursos(Request $request)
    {
        $profesorId = $request->user()->id;
        
        $cursos = Curso::where('instructor_id', $profesorId)
            ->with(['lecciones', 'inscripciones.alumno'])
            ->get();
        
        return response()->json(['data' => $cursos]);
    }

    /**
     * Obtener estudiantes de un curso específico
     */
    public function estudiantesCurso(Request $request, $cursoId)
    {
        $profesorId = $request->user()->id;
        
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $cursoId)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        
        $estudiantes = Inscripcion::where('curso_id', $cursoId)
            ->with(['alumno'])
            ->get()
            ->map(function($inscripcion) {
                return [
                    'id' => $inscripcion->alumno->id,
                    'name' => $inscripcion->alumno->name,
                    'email' => $inscripcion->alumno->email,
                    'progreso' => $inscripcion->progreso ?? 0,
                    'estado' => $inscripcion->estado,
                    'fecha_inscripcion' => $inscripcion->fecha_inscripcion
                ];
            });
        
        return response()->json(['data' => $estudiantes]);
    }

    /**
     * Exportar estudiantes de un curso a Excel
     */
    public function exportarEstudiantesCurso(Request $request, $cursoId)
    {
        $profesorId = $request->user()->id;
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $cursoId)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        $estudiantes = Inscripcion::where('curso_id', $cursoId)
            ->with(['alumno'])
            ->get()
            ->map(function($inscripcion) {
                return [
                    'ID' => $inscripcion->alumno->id,
                    'Nombre' => $inscripcion->alumno->name,
                    'Email' => $inscripcion->alumno->email,
                    'Progreso' => $inscripcion->progreso ?? 0,
                    'Estado' => $inscripcion->estado,
                    'Fecha de inscripción' => $inscripcion->fecha_inscripcion
                ];
            });
        $filename = 'estudiantes_curso_' . $cursoId . '_' . now()->format('Ymd_His') . '.xlsx';
        return Excel::download(new \App\Exports\EstudiantesExport($estudiantes), $filename);
    }

    /**
     * Crear nueva lección
     */
    public function crearLeccion(Request $request)
    {
        $profesorId = $request->user()->id;
        
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'contenido' => 'required|string',
            'duracion' => 'required|integer|min:1',
            'orden' => 'required|integer|min:1',
            'curso_id' => 'required|exists:cursos,id',
            'estado' => 'required|in:activo,inactivo,borrador'
        ]);
        
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $request->curso_id)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        
        $leccion = Leccion::create($request->all());
        
        return response()->json(['data' => $leccion], 201);
    }

    /**
     * Obtener lecciones de un curso
     */
    public function leccionesCurso(Request $request, $cursoId)
    {
        $profesorId = $request->user()->id;
        
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $cursoId)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        
        $lecciones = Leccion::where('curso_id', $cursoId)
            ->with(['multimedia'])
            ->orderBy('orden')
            ->get();
        
        return response()->json(['data' => $lecciones]);
    }

    /**
     * Actualizar progreso de estudiante
     */
    public function actualizarProgreso(Request $request, $inscripcionId)
    {
        $profesorId = $request->user()->id;
        
        $request->validate([
            'progreso' => 'required|integer|min:0|max:100'
        ]);
        
        $inscripcion = Inscripcion::whereHas('curso', function($query) use ($profesorId) {
            $query->where('instructor_id', $profesorId);
        })->findOrFail($inscripcionId);
        
        $inscripcion->update(['progreso' => $request->progreso]);
        
        return response()->json(['data' => $inscripcion]);
    }

    /**
     * Obtener estadísticas del curso
     */
    public function estadisticasCurso(Request $request, $cursoId)
    {
        $profesorId = $request->user()->id;
        
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $cursoId)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        
        $estadisticas = [
            'total_estudiantes' => Inscripcion::where('curso_id', $cursoId)->count(),
            'estudiantes_activos' => Inscripcion::where('curso_id', $cursoId)->where('estado', 'activo')->count(),
            'promedio_progreso' => Inscripcion::where('curso_id', $cursoId)->avg('progreso') ?? 0,
            'total_lecciones' => Leccion::where('curso_id', $cursoId)->count(),
            'lecciones_activas' => Leccion::where('curso_id', $cursoId)->where('estado', 'activo')->count()
        ];
        
        return response()->json(['data' => $estadisticas]);
    }

    /**
     * Obtener tareas de un curso
     */
    public function tareasCurso(Request $request, $cursoId)
    {
        $profesorId = $request->user()->id;
        
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $cursoId)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        
        $tareas = Tarea::where('curso_id', $cursoId)
            ->with(['leccion', 'entregas'])
            ->orderBy('fecha_entrega', 'asc')
            ->get();
        
        return response()->json(['data' => $tareas]);
    }

    /**
     * Crear nueva tarea
     */
    public function crearTarea(Request $request)
    {
        $profesorId = $request->user()->id;
        
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_asignacion' => 'required|date',
            'fecha_entrega' => 'required|date|after:fecha_asignacion',
            'tipo' => 'required|in:individual,grupal,opcional',
            'curso_id' => 'required|exists:cursos,id',
            'leccion_id' => 'nullable|exists:lecciones,id',
            'estado' => 'required|in:activa,inactiva,borrador',
            'puntos_maximos' => 'required|integer|min:1|max:100'
        ]);
        
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $request->curso_id)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        
        $tarea = Tarea::create($request->all());
        $tarea->load(['curso', 'leccion']);
        
        return response()->json(['data' => $tarea], 201);
    }

    /**
     * Obtener entregas de una tarea
     */
    public function entregasTarea(Request $request, $tareaId)
    {
        $profesorId = $request->user()->id;
        
        // Verificar que la tarea pertenece a un curso del profesor
        $tarea = Tarea::whereHas('curso', function($query) use ($profesorId) {
            $query->where('instructor_id', $profesorId);
        })->findOrFail($tareaId);
        
        $entregas = EntregaTarea::where('tarea_id', $tareaId)
            ->with(['estudiante'])
            ->orderBy('fecha_entrega', 'desc')
            ->get();
        
        return response()->json(['data' => $entregas]);
    }

    /**
     * Calificar una entrega
     */
    public function calificarEntrega(Request $request, $entregaId)
    {
        $profesorId = $request->user()->id;
        
        $request->validate([
            'calificacion' => 'required|numeric|min:0|max:100',
            'comentarios_profesor' => 'nullable|string'
        ]);
        
        // Verificar que la entrega pertenece a una tarea de un curso del profesor
        $entrega = EntregaTarea::whereHas('tarea.curso', function($query) use ($profesorId) {
            $query->where('instructor_id', $profesorId);
        })->findOrFail($entregaId);
        
        $entrega->update([
            'calificacion' => $request->calificacion,
            'comentarios_profesor' => $request->comentarios_profesor,
            'estado' => 'calificada'
        ]);
        
        $entrega->load(['tarea.curso', 'estudiante']);
        
        return response()->json(['data' => $entrega]);
    }

    /**
     * Exportar calificaciones de un curso a Excel
     */
    public function exportarCalificacionesCurso(Request $request, $cursoId)
    {
        $profesorId = $request->user()->id;
        // Verificar que el curso pertenece al profesor
        $curso = Curso::where('id', $cursoId)
            ->where('instructor_id', $profesorId)
            ->firstOrFail();
        $calificaciones = \App\Models\Calificacion::with(['estudiante', 'leccion', 'evaluador'])
            ->where('curso_id', $cursoId)
            ->where('estado', 'publicada')
            ->orderBy('fecha_evaluacion', 'desc')
            ->get()
            ->map(function($c) {
                return [
                    'ID Estudiante' => $c->estudiante->id,
                    'Nombre' => $c->estudiante->name,
                    'Email' => $c->estudiante->email,
                    'Lección' => $c->leccion ? $c->leccion->titulo : '-',
                    'Tipo Evaluación' => $c->tipo_evaluacion,
                    'Calificación' => $c->calificacion,
                    'Peso' => $c->peso,
                    'Comentarios' => $c->comentarios,
                    'Evaluador' => $c->evaluador ? $c->evaluador->name : '-',
                    'Fecha Evaluación' => $c->fecha_evaluacion,
                ];
            });
        $filename = 'calificaciones_curso_' . $cursoId . '_' . now()->format('Ymd_His') . '.xlsx';
        return \Maatwebsite\Excel\Facades\Excel::download(new CalificacionesExport($calificaciones), $filename);
    }
} 