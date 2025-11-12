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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_identification')->unique();
            $table->string('name');
            $table->unsignedTinyInteger('age')->nullable();
            $table->enum('nationality', ['KOREAN', 'CHINESE'])->nullable();
            $table->string('manager_type')->nullable();
            $table->string('email')->nullable();
            $table->string('category_level')->nullable();
            $table->string('class_type')->nullable();
            $table->enum('platform', ['Zoom', 'Voov'])->default('Zoom');
            $table->string('platform_link')->nullable();
            $table->string('preferred_book')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
