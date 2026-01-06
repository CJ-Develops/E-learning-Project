<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'thumbnail_url',
        'description',
    ];

    public function teachers()
    {
        return $this->belongsToMany(User::class, 'course_teacher', 'course_id', 'teacher_id')
            ->withTimestamps();
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot(['joined_at', 'progress_percent'])
            ->withTimestamps();
    }
}
