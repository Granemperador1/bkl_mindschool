<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DisponibilidadProfesor;
use App\Models\Asesoria;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AsesoriaController extends Controller
{
    // 1. Obtener disponibilidad de un profesor
    public function getDisponibilidadProfesor($profesor_id)
    {
        $disponibilidad = DisponibilidadProfesor::where('profesor_id', $profesor_id)
            ->where('activo', true)
            ->get();
        return response()->json($disponibilidad);
    }

    // 2. Definir disponibilidad (agregar bloque)
    public function definirDisponibilidad(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profesor_id' => 'required|exists:users,id',
            'dia_semana' => 'required|string',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $bloque = DisponibilidadProfesor::create($request->all());
        return response()->json($bloque, 201);
    }

    // 3. Reservar asesoría
    public function reservarAsesoria(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profesor_id' => 'required|exists:users,id',
            'estudiante_id' => 'required|exists:users,id',
            'fecha_hora_inicio' => 'required|date_format:H:i',
            'fecha_hora_fin' => 'required|date_format:H:i',
            'dia_semana' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Aquí podrías validar que el bloque esté disponible y no reservado
        $asesoria = Asesoria::create([
            'profesor_id' => $request->profesor_id,
            'estudiante_id' => $request->estudiante_id,
            'fecha_hora_inicio' => now()->next($request->dia_semana)->setTimeFromTimeString($request->fecha_hora_inicio),
            'fecha_hora_fin' => now()->next($request->dia_semana)->setTimeFromTimeString($request->fecha_hora_fin),
            'estado' => 'confirmada',
            'enlace_videollamada' => null, // Generar enlace real en integración
        ]);
        return response()->json($asesoria, 201);
    }

    // 4. Listar asesorías del usuario autenticado
    public function misAsesorias(Request $request)
    {
        $user = Auth::user();
        $asesorias = Asesoria::where('profesor_id', $user->id)
            ->orWhere('estudiante_id', $user->id)
            ->orderBy('fecha_hora_inicio', 'desc')
            ->get();
        return response()->json($asesorias);
    }

    // 5. Cancelar asesoría
    public function cancelarAsesoria($asesoria_id)
    {
        $asesoria = Asesoria::findOrFail($asesoria_id);
        $asesoria->estado = 'cancelada';
        $asesoria->save();
        return response()->json(['message' => 'Asesoría cancelada']);
    }

    // 6. Reprogramar asesoría
    public function reprogramarAsesoria(Request $request, $asesoria_id)
    {
        $asesoria = Asesoria::findOrFail($asesoria_id);
        $asesoria->fecha_hora_inicio = $request->fecha_hora_inicio;
        $asesoria->fecha_hora_fin = $request->fecha_hora_fin;
        $asesoria->estado = 'confirmada';
        $asesoria->save();
        return response()->json($asesoria);
    }

    // 7. Eliminar bloque de disponibilidad
    public function eliminarDisponibilidad($id)
    {
        $bloque = DisponibilidadProfesor::find($id);
        if (!$bloque) {
            return response()->json(['message' => 'Bloque no encontrado'], 404);
        }
        $bloque->delete();
        return response()->json(['message' => 'Bloque eliminado correctamente']);
    }
} 