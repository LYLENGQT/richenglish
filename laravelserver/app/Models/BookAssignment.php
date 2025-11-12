<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookAssignment extends Model
{
    protected $fillable = [
        'student_id',
        'teacher_id',
        'book_id',
        'assigned_by',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
