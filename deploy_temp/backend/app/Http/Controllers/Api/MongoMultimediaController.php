<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MongoMultimedia;
use App\Models\Multimedia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class MongoMultimediaController extends Controller
{
    // Subir archivo multimedia
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB
            'context' => 'required|string',
            'context_id' => 'required|integer',
            'type' => 'required|string',
        ]);

        $file = $request->file('file');
        $filename = Str::random(16) . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('uploads', $filename, 'public');
        $url = Storage::disk('public')->url($path);

        // Guardar en MongoDB
        $mongo = MongoMultimedia::create([
            'filename' => $filename,
            'mimetype' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'url' => $url,
            'uploaded_by' => $request->user()->id,
            'uploaded_at' => Carbon::now(),
            'context' => $request->context,
            'context_id' => $request->context_id,
            'type' => $request->type,
        ]);

        // Guardar referencia en MySQL
        $mysql = Multimedia::create([
            'titulo' => $filename,
            'descripcion' => '',
            'tipo' => $request->type,
            'url' => $url,
            'mongo_id' => $mongo->_id,
            'context' => $request->context,
            'context_id' => $request->context_id,
            'estado' => 'activo',
        ]);

        return response()->json(['mongo' => $mongo, 'mysql' => $mysql], 201);
    }

    // Descargar o previsualizar archivo
    public function show($id)
    {
        $mongo = MongoMultimedia::find($id);
        if (!$mongo) return response()->json(['error' => 'Archivo no encontrado'], 404);
        return response()->json($mongo);
    }

    // Eliminar archivo multimedia
    public function destroy($id)
    {
        $mongo = MongoMultimedia::find($id);
        if (!$mongo) return response()->json(['error' => 'Archivo no encontrado'], 404);
        // Eliminar archivo físico si está en disco
        if ($mongo->url && Str::startsWith($mongo->url, '/storage/')) {
            $path = str_replace('/storage/', '', $mongo->url);
            Storage::disk('public')->delete($path);
        }
        // Eliminar referencia en MySQL
        Multimedia::where('mongo_id', $mongo->_id)->delete();
        $mongo->delete();
        return response()->json(['message' => 'Archivo eliminado']);
    }

    // Listar archivos por contexto/context_id
    public function byContext($context, $context_id)
    {
        $archivos = MongoMultimedia::where('context', $context)
            ->where('context_id', intval($context_id))
            ->get();
        return response()->json($archivos);
    }
}
