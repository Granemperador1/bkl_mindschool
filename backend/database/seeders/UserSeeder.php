<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    
    public function run(): void
    {
        // Crear usuario administrador solo si no existe
        if (!User::where('email', 'admin@mindschool.com')->exists()) {
            $admin = User::create([
                'name' => 'Administrador',
                'email' => 'admin@mindschool.com',
                'password' => Hash::make('password123'),
            ]);
            $admin->assignRole('admin');
        }

        // Crear usuario profesor solo si no existe
        if (!User::where('email', 'profesor@mindschool.com')->exists()) {
            $profesor = User::create([
                'name' => 'Profesor Ejemplo',
                'email' => 'profesor@mindschool.com',
                'password' => Hash::make('password123'),
            ]);
            $profesor->assignRole('profesor');
        }

        // Crear usuario estudiante solo si no existe
        if (!User::where('email', 'estudiante@mindschool.com')->exists()) {
            $estudiante = User::create([
                'name' => 'Estudiante Ejemplo',
                'email' => 'estudiante@mindschool.com',
                'password' => Hash::make('password123'),
            ]);
            $estudiante->assignRole('estudiante');
        }

        // Crear algunos usuarios adicionales solo si no existen
        $usuarios = [
            [
                'name' => 'María García',
                'email' => 'maria@mindschool.com',
                'role' => 'estudiante'
            ],
            [
                'name' => 'Carlos López',
                'email' => 'carlos@mindschool.com',
                'role' => 'profesor'
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana@mindschool.com',
                'role' => 'estudiante'
            ],
            [
                'name' => 'Luis Rodríguez',
                'email' => 'luis@mindschool.com',
                'role' => 'profesor'
            ]
        ];

        foreach ($usuarios as $usuarioData) {
            if (!User::where('email', $usuarioData['email'])->exists()) {
                $usuario = User::create([
                    'name' => $usuarioData['name'],
                    'email' => $usuarioData['email'],
                    'password' => Hash::make('password123'),
                ]);
                $usuario->assignRole($usuarioData['role']);
            }
        }

        // Profesores especiales SOLO si no existen, con correos @LMS.com y nombre genérico
        for ($i = 1; $i <= 30; $i++) {
            $num = str_pad($i, 2, '0', STR_PAD_LEFT);
            $email = 'profesor' . $num . '@LMS.com';
            $password = Hash::make('mindschool_profesor_' . $num);
            $name = 'Profesor Especial ' . $num;
            if (!User::where('email', $email)->exists()) {
                $usuario = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => $password,
                ]);
                $usuario->assignRole('profesor');
            }
        }
    }
} 