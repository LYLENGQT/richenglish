<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'teacher_id',
        'student_id',
        'book_id',
        'type',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'duration',
        'reoccurring_days',
        'platform_link',
        'reason',
        'note',
        'original_class_id',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'reoccurring_days' => 'array',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function originalClass()
    {
        return $this->belongsTo(self::class, 'original_class_id');
    }

    public function makeUpClasses()
    {
        return $this->hasMany(self::class, 'original_class_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    public function recordings()
    {
        return $this->hasMany(Recording::class, 'class_id');
    }

    public function screenshots()
    {
        return $this->hasMany(Screenshot::class, 'class_id');
    }
}
