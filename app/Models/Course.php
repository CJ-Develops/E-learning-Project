<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['instructor_id', 'title', 'description',];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    // 👇 Make sure this is here too!
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}