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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('position')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('status')->nullable();
            $table->string('image_url')->nullable();
            $table->string('phone')->nullable();
            $table->string('work_hours_start')->nullable();
            $table->string('work_hours_end')->nullable();
            $table->string('break_time')->nullable();
            $table->json('days_off')->nullable();
            $table->string('leave_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};