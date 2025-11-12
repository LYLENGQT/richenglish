<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'country',
        'status',
        'timezone',
        'role',
        'accepted',
        'reset_otp',
        'reset_expires_at',
        'meta',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'accepted' => 'boolean',
            'reset_expires_at' => 'datetime',
            'meta' => 'array',
        ];
    }

    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    public function assignedTeachers()
    {
        return $this->belongsToMany(User::class, 'admin_teacher', 'admin_id', 'teacher_id');
    }

    public function assignedAdmins()
    {
        return $this->belongsToMany(User::class, 'admin_teacher', 'teacher_id', 'admin_id');
    }

    public function classesTeaching()
    {
        return $this->hasMany(ClassSchedule::class, 'teacher_id');
    }

    public function classesCreated()
    {
        return $this->hasMany(ClassSchedule::class, 'created_by');
    }

    public function notifications()
    {
        return $this->hasMany(UserNotification::class);
    }

    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesReceived()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function bookAssignments()
    {
        return $this->hasMany(BookAssignment::class, 'teacher_id');
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class, 'teacher_id');
    }

    public function scopeTeachers($query)
    {
        return $query->where('role', 'teacher');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super-admin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }
}
