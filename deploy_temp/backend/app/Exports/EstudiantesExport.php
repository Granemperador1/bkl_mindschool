<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class EstudiantesExport implements FromCollection, WithHeadings
{
    protected $estudiantes;

    public function __construct($estudiantes)
    {
        $this->estudiantes = $estudiantes;
    }

    public function collection()
    {
        return new Collection($this->estudiantes);
    }

    public function headings(): array
    {
        return [
            'ID', 'Nombre', 'Email', 'Progreso', 'Estado', 'Fecha de inscripción'
        ];
    }
} 