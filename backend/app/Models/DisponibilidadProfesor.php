<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisponibilidadProfesor extends Model
{
    use HasFactory;

    protected $table = 'disponibilidades_profesor';
    protected $fillable = [
        'profesor_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
        'activo',
    ];

    public function profesor()
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }
} 