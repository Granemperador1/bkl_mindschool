<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MiembroGrupo extends Model
{
    protected $table = 'miembros_grupo';
    
    protected $fillable = [
        'grupo_id',
        'user_id',
        'rol',
        'fecha_ingreso'
    ];

    protected $casts = [
        'fecha_ingreso' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Relación con el grupo
     */
    public function grupo(): BelongsTo
    {
        return $this->belongsTo(GrupoTrabajo::class, 'grupo_id');
    }

    /**
     * Relación con el usuario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
