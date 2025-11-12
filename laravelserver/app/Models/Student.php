<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_identification',
        'name',
        'age',
        'nationality',
        'manager_type',
        'email',
        'category_level',
        'class_type',
        'platform',
        'platform_link',
        'preferred_book',
    ];

    protected $casts = [
        'age' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Student $student) {
            if (! $student->student_identification) {
                $student->student_identification = self::generateIdentifier();
            }
        });
    }

    public static function generateIdentifier(): string
    {
        return 'STD'.strtoupper(substr(str_replace('-', '', (string) str()->uuid()), 0, 7));
    }

    public function classes()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function bookAssignments()
    {
        return $this->hasMany(BookAssignment::class);
    }
}
