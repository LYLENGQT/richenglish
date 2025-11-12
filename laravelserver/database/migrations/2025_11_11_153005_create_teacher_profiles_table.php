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
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('degree')->nullable();
            $table->string('major')->nullable();
            $table->string('english_level')->nullable();
            $table->string('experience')->nullable();
            $table->text('motivation')->nullable();
            $table->string('availability')->nullable();
            $table->string('internet_speed')->nullable();
            $table->string('computer_specs')->nullable();
            $table->boolean('has_webcam')->default(false);
            $table->boolean('has_headset')->default(false);
            $table->boolean('has_backup_internet')->default(false);
            $table->boolean('has_backup_power')->default(false);
            $table->text('teaching_environment')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('intro_video_url')->nullable();
            $table->string('speed_test_screenshot_url')->nullable();
            $table->foreignId('assigned_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('zoom_link')->nullable();
            $table->date('birth_day')->nullable();
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
