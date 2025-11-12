<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'teacher_id',
        'student_id',
        'class_id',
        'date',
        'duration',
        'start_time',
        'end_time',
        'minutes_attended',
        'hours',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'float',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'class_id');
    }

    public function screenshots()
    {
        return $this->hasMany(Screenshot::class);
    }

    public function recording()
    {
        return $this->hasOne(Recording::class);
    }
}
