<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    // We updated 'instructions' to 'description' earlier, so this is correct:
    protected $fillable = ['course_id', 'title', 'description', 'due_date'];

    // 👇 THIS IS THE MISSING BRIDGE!
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}