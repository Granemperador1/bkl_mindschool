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
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

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
                'tipo_usuario' => 'required|in:estudiante,profesor',
                'codigo_especial' => 'nullable|string|max:100',
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

        // Asignar rol según tipo_usuario
        $rol = $request->tipo_usuario === 'profesor' ? 'profesor' : 'estudiante';
        $roleObj = \Spatie\Permission\Models\Role::where('name', $rol)->first();
        if (!$roleObj) {
            $roleObj = \Spatie\Permission\Models\Role::create(['name' => $rol]);
        }

        // Asegurar que codigo_especial sea null si viene vacío
        $codigoEspecial = $request->filled('codigo_especial') && $request->codigo_especial !== '' ? $request->codigo_especial : null;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'tipo_usuario' => $request->tipo_usuario,
            'codigo_especial' => $codigoEspecial,
        ]);
        $user->assignRole($roleObj);

        // Lógica para clases especiales (inscribir en curso si el código es válido)
        if ($request->filled('codigo_especial')) {
            $cursoEspecial = \App\Models\Curso::where('codigo_invitacion', $request->codigo_especial)->first();
            if ($cursoEspecial) {
                // Inscribir al usuario en el curso especial
                $cursoEspecial->alumnos()->attach($user->id, ['tipo_acceso' => 'invitacion']);
                \App\Models\Inscripcion::firstOrCreate(
                    ['user_id' => $user->id, 'curso_id' => $cursoEspecial->id],
                    ['estado' => 'activo', 'fecha_inscripcion' => now(), 'progreso' => 0]
                );
                // Notificar al usuario
                $user->notify(new \App\Notifications\NuevaInscripcion([
                    'curso' => $cursoEspecial->titulo,
                    'alumno' => $user->name
                ]));
            } else {
                // Si el código no es válido, puedes lanzar un error o ignorar
                // return response()->json(['message' => 'Código especial inválido'], 422);
            }
        }

        // Mensaje de bienvenida
        $mensajeBienvenida = "¡Bienvenido a Casa, Futuro Líder!\n\n¡Hola! Nos alegra muchísimo que ya seas parte de la familia MindSchool.\n\nSabemos que dar el primer paso en un nuevo camino puede sentirse grande, pero queremos que sepas algo fundamental: aquí no estás solo. Desde este momento, te conviertes en una pieza clave de nuestra comunidad.\n\nEn MindSchool, creemos firmemente en el poder de cada persona para crecer, aprender y alcanzar sus sueños. Aquí, cada lección, cada conversación y cada desafío está diseñado para que descubras tu verdadero potencial y construyas un futuro que te apasione.\n\nNos dedicamos a crear un espacio donde te sientas seguro, apoyado y, sobre todo, valorado. Queremos que te diviertas mientras aprendes, que compartas tus ideas sin miedo y que encuentres amistades que te acompañen en este increíble viaje. Estamos aquí para ti, para escucharte y para ayudarte en cada paso del camino.\n\nAsí que, respira hondo y prepárate para una aventura llena de descubrimientos. Tu viaje empieza ahora, y estamos emocionados de ser parte de él.\n\n¡Bienvenido a tu nueva familia!\n\nCon un abrazo cálido,\n\nEl equipo de MindSchool";

        \Illuminate\Support\Facades\Mail::raw(
            $mensajeBienvenida,
            function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('¡Bienvenido a MindSchool!');
            }
        );
        $user->notify(new \App\Notifications\NotificacionPersonalizada($mensajeBienvenida));

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

    public function googleLogin(Request $request)
    {
        try {
            $token = $request->input('credential') ?? $request->input('token');
            if (!$token) {
                return response()->json(['error' => 'No token provided'], 400);
            }

            $googleUser = Socialite::driver('google')->stateless()->userFromToken($token);

            // Buscar si el usuario ya existe por email
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Crear nuevo usuario con datos de Google
                $user = User::create([
                    'name' => $googleUser->getName() ?? 'Usuario Google',
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(16)), // Password aleatorio
                    'avatar_url' => $googleUser->getAvatar(),
                ]);

                // Verificar que el rol 'estudiante' existe antes de asignarlo
                $estudianteRole = Role::where('name', 'estudiante')->first();
                if (!$estudianteRole) {
                    $estudianteRole = Role::create(['name' => 'estudiante']);
                }
                
                // Asignar rol por defecto (estudiante)
                $user->assignRole($estudianteRole);

                // Mensaje de bienvenida para usuarios de Google
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
            }

            // Cargar roles para la respuesta
            $user->load('roles');
            $userArr = $user->toArray();
            $userArr['roles'] = $user->roles->pluck('name')->toArray();
            
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $userArr,
                'token' => $token
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 