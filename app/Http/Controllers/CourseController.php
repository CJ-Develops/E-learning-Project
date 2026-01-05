<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // GET ALL COURSES
    public function index()
    {
        return response()->json(Course::with('teacher')->latest()->get());
    }

    // CREATE COURSE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string'
        ]);

        // Assign to current user
        $validated['user_id'] = $request->user()->id; 

        $course = Course::create($validated);

        return response()->json(['message' => 'Course created', 'course' => $course], 201);
    }

    // UPDATE COURSE
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $course->update($request->all());
        return response()->json(['message' => 'Course updated', 'course' => $course]);
    }

    // DELETE COURSE
    public function destroy($id)
    {
        Course::destroy($id);
        return response()->json(['message' => 'Course deleted']);
    }
}