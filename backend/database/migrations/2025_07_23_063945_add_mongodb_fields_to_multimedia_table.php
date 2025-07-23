<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('multimedia', function (Blueprint $table) {
            $table->string('mongo_id', 48)->nullable()->after('id'); // Referencia al _id de MongoDB
            $table->string('context', 32)->nullable()->after('url'); // tarea, entrega, leccion, etc.
            $table->unsignedBigInteger('context_id')->nullable()->after('context'); // id de la tarea, entrega, etc.
            $table->unsignedBigInteger('leccion_id')->nullable()->change(); // Hacer leccion_id nullable
        });
    }

    public function down()
    {
        Schema::table('multimedia', function (Blueprint $table) {
            $table->dropColumn(['mongo_id', 'context', 'context_id']);
            $table->unsignedBigInteger('leccion_id')->nullable(false)->change();
        });
    }
};
