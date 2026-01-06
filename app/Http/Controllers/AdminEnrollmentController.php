<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;

class AdminEnrollmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Enrollment::select('user_id', 'course_id')->get()
        );
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        $enrollment = Enrollment::where('user_id', $data['user_id'])
            ->where('course_id', $data['course_id'])
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'Enrollment not found.'], 404);
        }

        $enrollment->delete();

        return response()->json(['message' => 'User removed from course.']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        $user = User::findOrFail($data['user_id']);
        $course = Course::findOrFail($data['course_id']);

        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'User already enrolled in this course.',
                'enrollment' => $existing,
            ]);
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'joined_at' => now(),
            'progress_percent' => 0,
        ]);

        return response()->json([
            'message' => 'User enrolled successfully.',
            'enrollment' => $enrollment,
        ], 201);
    }
}
