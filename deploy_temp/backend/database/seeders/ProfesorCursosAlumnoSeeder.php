<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Curso;
use Illuminate\Support\Facades\Hash;

class ProfesorCursosAlumnoSeeder extends Seeder
{
    public function run()
    {
        // Crear profesor
        $profesor = User::create([
            'name' => 'Profesor Demo',
            'email' => 'profesor@mindschool.com',
            'password' => Hash::make('profesor123'),
        ]);
        $profesor->assignRole('profesor');

        // Crear 3 cursos básicos
        $cursos = [
            [
                'titulo' => 'Matemáticas Básicas',
                'descripcion' => 'Curso introductorio de matemáticas.',
                'duracion' => '3 meses',
                'nivel' => 'básico',
                'precio' => 0,
                'estado' => 'activo',
                'instructor_id' => $profesor->id,
            ],
            [
                'titulo' => 'Introducción a la Programación',
                'descripcion' => 'Aprende los fundamentos de la programación.',
                'duracion' => '3 meses',
                'nivel' => 'básico',
                'precio' => 0,
                'estado' => 'activo',
                'instructor_id' => $profesor->id,
            ],
            [
                'titulo' => 'Ciencias Naturales',
                'descripcion' => 'Explora el mundo de las ciencias.',
                'duracion' => '3 meses',
                'nivel' => 'básico',
                'precio' => 0,
                'estado' => 'activo',
                'instructor_id' => $profesor->id,
            ],
        ];
        foreach ($cursos as $curso) {
            Curso::create($curso);
        }

        // Crear alumno adicional
        $alumno = User::create([
            'name' => 'Alumno Demo',
            'email' => 'alumno2@mindschool.com',
            'password' => Hash::make('alumno123'),
        ]);
        $alumno->assignRole('estudiante');
    }
} 