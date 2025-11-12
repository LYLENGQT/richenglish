<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Screenshot extends Model
{
    protected $fillable = [
        'class_id',
        'attendance_id',
        'uploaded_by',
        'path',
        'filename',
        'drive',
    ];

    protected $casts = [
        'drive' => 'array',
    ];

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'class_id');
    }

    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
