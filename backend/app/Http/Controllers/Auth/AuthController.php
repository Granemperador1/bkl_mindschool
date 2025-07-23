<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = $e->errors();
            // Personalizar el mensaje para el error de email único
            if (isset($errors['email']) && in_array('The email has already been taken.', $errors['email'])) {
                $errors['email'] = ['Este correo electrónico ya está registrado. Por favor, usa otro.'];
            }
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $errors
            ], 422);
        }

        // Ignorar cualquier valor de 'role' recibido y asignar siempre 'estudiante'
        // (ya está implementado: no se usa $request->role en ningún momento)
        // Solo para mayor claridad, eliminamos cualquier referencia a 'role' en la validación
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
            ],
            // 'role' => 'prohibido', // No se valida ni se usa
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Verificar que el rol 'estudiante' existe antes de asignarlo
        $estudianteRole = Role::where('name', 'estudiante')->first();
        if (!$estudianteRole) {
            // Si no existe, crear el rol
            $estudianteRole = Role::create(['name' => 'estudiante']);
        }
        
        // Asignar rol por defecto (estudiante)
        $user->assignRole($estudianteRole);

        // Mensaje de bienvenida
        $mensajeBienvenida = "¡Bienvenido a Casa, Futuro Líder!\n\n¡Hola! Nos alegra muchísimo que ya seas parte de la familia MindSchool.\n\nSabemos que dar el primer paso en un nuevo camino puede sentirse grande, pero queremos que sepas algo fundamental: aquí no estás solo. Desde este momento, te conviertes en una pieza clave de nuestra comunidad.\n\nEn MindSchool, creemos firmemente en el poder de cada persona para crecer, aprender y alcanzar sus sueños. Aquí, cada lección, cada conversación y cada desafío está diseñado para que descubras tu verdadero potencial y construyas un futuro que te apasione.\n\nNos dedicamos a crear un espacio donde te sientas seguro, apoyado y, sobre todo, valorado. Queremos que te diviertas mientras aprendes, que compartas tus ideas sin miedo y que encuentres amistades que te acompañen en este increíble viaje. Estamos aquí para ti, para escucharte y para ayudarte en cada paso del camino.\n\nAsí que, respira hondo y prepárate para una aventura llena de descubrimientos. Tu viaje empieza ahora, y estamos emocionados de ser parte de él.\n\n¡Bienvenido a tu nueva familia!\n\nCon un abrazo cálido,\n\nEl equipo de MindSchool";

        // Enviar correo de bienvenida
        Mail::raw(
            $mensajeBienvenida,
            function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('¡Bienvenido a MindSchool!');
            }
        );

        // Enviar notificación interna de bienvenida
        $user->notify(new \App\Notifications\NotificacionPersonalizada($mensajeBienvenida));

        // Cargar roles para la respuesta
        $user->load('roles');
        $userArr = $user->toArray();
        $userArr['roles'] = $user->roles->pluck('name')->toArray();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $userArr,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        
        // Cargar los roles del usuario
        $user->load('roles');
        $userArr = $user->toArray();
        $userArr['roles'] = $user->roles->pluck('name')->toArray();
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $userArr,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }
} 