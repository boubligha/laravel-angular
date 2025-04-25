<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->date('date_creation')->nullable();
            $table->date('date_echeance')->nullable();
            $table->string('priorite')->nullable();
            $table->string('statut')->nullable();
            $table->foreignId('projet_id')->constrained('projets')->onDelete('cascade'); // Relation avec 'projets'
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');   // Relation avec 'users' (assignée à)
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taches');
    }
};
