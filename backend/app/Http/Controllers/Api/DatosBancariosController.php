<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DatosBancarios;

class DatosBancariosController extends Controller
{
    // Obtener los datos bancarios del usuario autenticado
    public function show(Request $request)
    {
        $user = $request->user();
        $datos = DatosBancarios::where('usuario_id', $user->id)->first();
        return response()->json(['data' => $datos]);
    }

    // Guardar o actualizar los datos bancarios del usuario autenticado
    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'banco' => 'required|string|max:100',
            'clabe' => 'required|string|max:30',
            'titular' => 'required|string|max:100',
        ]);
        $datos = DatosBancarios::updateOrCreate(
            ['usuario_id' => $user->id],
            [
                'banco' => $validated['banco'],
                'clabe' => $validated['clabe'],
                'titular' => $validated['titular'],
            ]
        );
        return response()->json(['message' => 'Datos bancarios guardados correctamente', 'data' => $datos]);
    }
} 