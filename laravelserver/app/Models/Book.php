<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'filename',
        'original_filename',
        'path',
        'drive',
        'uploaded_by',
    ];

    protected $casts = [
        'drive' => 'array',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function classes()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function assignments()
    {
        return $this->hasMany(BookAssignment::class);
    }

    public function bookAssignments()
    {
        return $this->hasMany(BookAssignment::class);
    }
}
