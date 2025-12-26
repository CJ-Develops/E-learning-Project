<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    // 1. Show the list of lessons for a specific course
    public function index(Course $course)
    {
        // Security: Ensure only the owner can manage lessons
        if ($course->instructor_id !== auth()->id()) {
            abort(403);
        }

        return view('teacher.lessons.index', compact('course'));
    }

    // 2. Store a new lesson
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'title' => 'required',
            'video_url' => 'nullable|url', // Basic URL validation
        ]);

        $course->lessons()->create([
            'title' => $request->title,
            'video_url' => $request->video_url,
            'content' => $request->content,
            'position' => $course->lessons()->count() + 1, // Add to end of list
        ]);

        return back()->with('success', 'Lesson added successfully!');
    }
}