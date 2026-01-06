<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Aggregate headline stats
        $totalScholars = User::where('role', 0)->count();
        $facultyMembers = User::where('role', 1)->count();
        $activeCurriculums = Course::count();

        // Fetch latest courses with teacher name attached
        $recentCourses = Course::with(['teachers:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'created_at'])
            ->map(function (Course $course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'created_at' => $course->created_at,
                    'teacher_name' => optional($course->teachers->first())->name,
                    'teacher_names' => $course->teachers->pluck('name')->values(),
                ];
            });

        return response()->json([
            'total_scholars' => $totalScholars,
            'active_curriculums' => $activeCurriculums,
            'faculty_members' => $facultyMembers,
            'recent_courses' => $recentCourses,
        ]);
    }
}
