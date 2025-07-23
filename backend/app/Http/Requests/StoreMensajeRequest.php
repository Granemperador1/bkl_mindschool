<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMensajeRequest extends FormRequest
{
    public function authorize()
    {
        // Permitir que cualquier usuario autenticado cree mensajes
        return auth()->check();
    }

    public function rules()
    {
        return [
            'destinatario_id' => 'required|exists:users,id',
            'asunto' => 'required|string|max:255',
            'contenido' => 'required|string',
            // Si tienes archivos adjuntos, puedes agregar reglas aquí
            // 'archivo' => 'nullable|file|max:10240', // 10MB
        ];
    }
}
