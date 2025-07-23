<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asesoria extends Model
{
    use HasFactory;

    protected $table = 'asesorias';
    protected $fillable = [
        'profesor_id',
        'estudiante_id',
        'fecha_hora_inicio',
        'fecha_hora_fin',
        'estado',
        'enlace_videollamada',
        'notas',
    ];

    public function profesor()
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    public function estudiante()
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }
} 