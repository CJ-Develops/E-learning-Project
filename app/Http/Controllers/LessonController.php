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
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url', // ✅ Validate URL
        ]);

        $course->lessons()->create([
            'title' => $request->title,
            'content' => $request->content,
            'video_url' => $request->video_url, // ✅ Save URL
        ]);

        return redirect()->back()->with('success', 'Lesson added successfully!');
    }

    // 3. SHOW EDIT FORM
    public function edit(\App\Models\Lesson $lesson)
    {
        return view('teacher.lessons.edit', compact('lesson'));
    }

    // 4. UPDATE LESSON
    public function update(\Illuminate\Http\Request $request, \App\Models\Lesson $lesson)
    {
        $request->validate([
            'title'     => 'required|string|max:255',
            'content'   => 'nullable|string', 
            'video_url' => 'nullable|url', // ✅ Now we allow updating the URL
        ]);

        $lesson->update($request->all());

        return redirect()->route('teacher.lessons.index', $lesson->course_id)
                         ->with('success', 'Lesson updated successfully!');
    }

    // 5. DELETE LESSON
    public function destroy(\App\Models\Lesson $lesson)
    {
        $courseId = $lesson->course_id; // Save ID before deleting to redirect back
        $lesson->delete();
        
        return redirect()->route('teacher.lessons.index', $courseId)
                         ->with('success', 'Lesson deleted successfully!');
    }
}