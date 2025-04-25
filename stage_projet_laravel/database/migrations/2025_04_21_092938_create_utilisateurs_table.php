<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // database/migrations/xxxx_xx_xx_xx_drop_utilisateurs_table.php
public function up()
{
    Schema::dropIfExists('utilisateurs');  // Supprime la table 'utilisateurs' si elle existe
}

public function down()
{
    // Optionnel : Re-crée la table utilisateurs si la migration est annulée
    Schema::create('utilisateurs', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('email')->unique();
        $table->string('mot_de_passe');
        $table->string('role');
        $table->string('statut')->nullable();
        $table->timestamps();
    });
}

};
