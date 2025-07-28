<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('tareas', function (Blueprint $table) {
            $table->string('tipo', 20)->change();
        });
    }

    public function down()
    {
        Schema::table('tareas', function (Blueprint $table) {
            $table->string('tipo', 8)->change(); // Ajusta al tamaño original si era diferente
        });
    }
};
