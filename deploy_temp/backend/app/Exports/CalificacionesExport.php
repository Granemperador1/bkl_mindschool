<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class CalificacionesExport implements FromCollection, WithHeadings
{
    protected $calificaciones;

    public function __construct($calificaciones)
    {
        $this->calificaciones = $calificaciones;
    }

    public function collection()
    {
        return new Collection($this->calificaciones);
    }

    public function headings(): array
    {
        return [
            'ID Estudiante', 'Nombre', 'Email', 'Lección', 'Tipo Evaluación', 'Calificación', 'Peso', 'Comentarios', 'Evaluador', 'Fecha Evaluación'
        ];
    }
} 