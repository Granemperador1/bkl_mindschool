<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrupoTrabajo extends Model
{
    protected $table = 'grupos_trabajo';
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'max_estudiantes',
        'estado',
        'codigo_acceso',
        'auto_asignacion',
        'fecha_inicio',
        'fecha_fin',
        'objetivos',
        'configuracion',
        'creador_id'
    ];

    protected $casts = [
        'max_estudiantes' => 'integer',
        'auto_asignacion' => 'boolean',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'configuracion' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Relación con el curso
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }

    /**
     * Relación con el creador del grupo
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creador_id');
    }

    /**
     * Relación con los miembros del grupo
     */
    public function miembros(): HasMany
    {
        return $this->hasMany(MiembroGrupo::class, 'grupo_id');
    }
}
