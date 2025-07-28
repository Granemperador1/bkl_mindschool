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
            'http://localhost:8000',
            'http://127.0.0.1:8000',
        ];
        $origin = $request->header('Origin');
        // Permitir cualquier IP de la LAN 192.168.x.x
        $isLan = preg_match('/^http:\/\/192\.168\.\d+\.\d+(?::\d+)?$/', $origin);
        $origin = (in_array($origin, $allowedOrigins) || $isLan) ? $origin : '*';

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
