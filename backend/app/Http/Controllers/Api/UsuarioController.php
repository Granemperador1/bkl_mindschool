<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $usuarios = User::with('roles')->get();
        
        // Convertir roles a array simple para el frontend
        $usuarios->each(function ($usuario) {
            $usuario->roles = $usuario->roles->pluck('name')->toArray();
        });
        
        return response()->json(['data' => $usuarios]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:estudiante,profesor,admin'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Verificar que el rol existe antes de asignarlo
        $role = Role::where('name', $request->role)->first();
        if (!$role) {
            return response()->json(['error' => 'Rol no válido'], 400);
        }

        // Asignar rol
        $user->assignRole($role);

        // Cargar roles para la respuesta
        $user->load('roles');
        $user->roles = $user->roles->pluck('name')->toArray();

        return response()->json(['data' => $user], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $usuario)
    {
        $usuario->load('roles');
        $usuario->roles = $usuario->roles->pluck('name')->toArray();
        
        return response()->json(['data' => $usuario]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => [
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($usuario->id)
            ],
            'password' => 'nullable|string|min:8',
            'role' => 'string|in:estudiante,profesor,admin'
        ]);

        $data = $request->only(['name', 'email']);
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);

        // Actualizar rol si se proporciona
        if ($request->filled('role')) {
            $role = Role::where('name', $request->role)->first();
            if (!$role) {
                return response()->json(['error' => 'Rol no válido'], 400);
            }
            $usuario->syncRoles([$role]);
        }

        // Cargar roles para la respuesta
        $usuario->load('roles');
        $usuario->roles = $usuario->roles->pluck('name')->toArray();

        return response()->json(['data' => $usuario]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $usuario)
    {
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado exitosamente']);
    }

    /**
     * Actualizar rol de usuario
     */
    public function updateRole(Request $request, User $usuario)
    {
        $request->validate([
            'role' => 'required|string|in:estudiante,profesor,admin'
        ]);

        $role = Role::where('name', $request->role)->first();
        if (!$role) {
            return response()->json(['error' => 'Rol no válido'], 400);
        }

        $usuario->syncRoles([$role]);

        // Cargar roles para la respuesta
        $usuario->load('roles');
        $usuario->roles = $usuario->roles->pluck('name')->toArray();

        return response()->json(['data' => $usuario]);
    }

    /**
     * Obtener datos de perfil del usuario autenticado
     */
    public function perfil(Request $request)
    {
        return response()->json(['data' => $request->user()]);
    }

    /**
     * Actualizar datos de perfil (nombre, email, avatar, etc)
     */
    public function actualizarPerfil(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|max:255|unique:users,email,' . $user->id,
            'avatar_url' => 'nullable|url',
        ]);
        $user->update($data);
        return response()->json(['message' => 'Perfil actualizado', 'data' => $user]);
    }

    /**
     * Cambiar contraseña
     */
    public function cambiarPassword(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'password_actual' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);
        if (!\Hash::check($request->password_actual, $user->password)) {
            return response()->json(['error' => 'La contraseña actual no es correcta'], 422);
        }
        $user->password = \Hash::make($request->password);
        $user->save();
        return response()->json(['message' => 'Contraseña actualizada']);
    }

    /**
     * Actualizar configuración/preferencias del usuario
     */
    public function actualizarConfiguracion(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'configuracion' => 'array',
        ]);
        $user->configuracion = $data['configuracion'];
        $user->save();
        return response()->json(['message' => 'Configuración actualizada', 'data' => $user->configuracion]);
    }

    /**
     * Obtener lista de contactos para mensajería (excluye admins y el propio usuario)
     */
    public function contactos(Request $request)
    {
        $user = $request->user();
        $contactos = User::where('id', '!=', $user->id)
            ->whereDoesntHave('roles', function($q) {
                $q->where('name', 'admin');
            })
            ->select('id', 'name', 'email')
            ->get();
        return response()->json(['data' => $contactos]);
    }
} 