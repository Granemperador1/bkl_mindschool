<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurso extends Model
{
    use HasFactory;

    protected $table = 'recursos';
    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'url',
        'curso_id',
        'estado',
        'creador_id',
    ];

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'creador_id');
    }
} 