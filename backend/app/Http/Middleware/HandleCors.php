<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    public function handle($request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://192.168.100.4:5173',
            'http://localhost:8000',
            'http://192.168.100.4:8000',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];

        $origin = $request->header('Origin');
        
        // Si el origen está en la lista de permitidos, lo usamos, de lo contrario usamos '*'
        $origin = in_array($origin, $allowedOrigins) ? $origin : '*';

        $headers = [
            'Access-Control-Allow-Origin'      => $origin,
            'Access-Control-Allow-Methods'     => 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
            'Access-Control-Allow-Headers'     => 'Content-Type, X-Auth-Token, Origin, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age'           => '86400',
            'Access-Control-Expose-Headers'    => 'Authorization',
            'Vary'                             => 'Origin'
        ];

        if ($request->isMethod('OPTIONS')) {
            return response()->json('OK', 200, $headers);
        }

        $response = $next($request);
        
        // Agregar encabezados CORS a la respuesta
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
