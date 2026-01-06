<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Course::with('teachers:id,name')->latest();

        // Admin sees all; teachers see only their assigned courses
        if ((int) $user->role !== 2) {
            $query->whereHas('teachers', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        // Only admins can create courses
        if ((int) $user->role !== 2) {
            abort(403, 'Only admins can create courses');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail_url' => 'nullable|url',
            'teachers' => 'required|array|min:1',
            'teachers.*' => 'exists:users,id',
        ]);

        $course = Course::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'thumbnail_url' => $validated['thumbnail_url'] ?? null,
        ]);
        $course->teachers()->attach($validated['teachers']);

        $course->load('teachers:id,name');
        return response()->json(['message' => 'Course created', 'course' => $course], 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();
        // Only admins can update course metadata
        if ((int) $user->role !== 2) {
            abort(403, 'Only admins can update courses');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail_url' => 'nullable|url',
            'teachers' => 'required|array|min:1',
            'teachers.*' => 'exists:users,id',
        ]);

        $course->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'thumbnail_url' => $validated['thumbnail_url'] ?? null,
        ]);
        $course->teachers()->sync($validated['teachers']);
        $course->load('teachers:id,name');
        return response()->json(['message' => 'Course updated', 'course' => $course]);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $user = request()->user();
        // Only admins can delete courses
        if ((int) $user->role !== 2) {
            abort(403, 'Only admins can delete courses');
        }

        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }

    public function students($id)
    {
        $course = Course::findOrFail($id);

        $students = $course->students()
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json($students);
    }
}
