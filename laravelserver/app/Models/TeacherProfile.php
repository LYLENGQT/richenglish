<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'degree',
        'major',
        'english_level',
        'experience',
        'motivation',
        'availability',
        'internet_speed',
        'computer_specs',
        'has_webcam',
        'has_headset',
        'has_backup_internet',
        'has_backup_power',
        'teaching_environment',
        'resume_url',
        'intro_video_url',
        'speed_test_screenshot_url',
        'assigned_admin_id',
        'zoom_link',
        'birth_day',
    ];

    protected $casts = [
        'has_webcam' => 'boolean',
        'has_headset' => 'boolean',
        'has_backup_internet' => 'boolean',
        'has_backup_power' => 'boolean',
        'birth_day' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }
}
