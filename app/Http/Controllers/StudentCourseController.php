<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentCourseController extends Controller
{
    
    public function index(Request $request)
    {
        $studentId = $request->user()->id;

        $courses = Course::query()
            ->select('id', 'title', 'thumbnail_url', 'description')
            ->withCount('lessons')
            ->with([
                'teachers:id,name',
                'enrollments' => function ($query) use ($studentId) {
                    $query->where('user_id', $studentId)
                        ->select('id', 'course_id', 'user_id', 'progress_percent', 'joined_at');
                },
            ])
            ->whereHas('enrollments', function ($query) use ($studentId) {
                $query->where('user_id', $studentId);
            })
            ->get()
            ->map(function ($course) {
                $enrollment = $course->enrollments->first();

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'thumbnail_url' => $course->thumbnail_url,
                    'description' => $course->description,
                    'teacher_name' => optional($course->teachers->first())->name,
                    'teacher_names' => $course->teachers->pluck('name')->values(),
                    'lessons_count' => $course->lessons_count ?? 0,
                    'progress' => $enrollment->progress_percent ?? 0,
                ];
            })
            ->values();

        return response()->json($courses);
    }

   
    public function show(Request $request, Course $course)
    {
        $studentId = $request->user()->id;

        // Auto-enroll on access
        Enrollment::firstOrCreate(
            ['user_id' => $studentId, 'course_id' => $course->id],
            ['joined_at' => now(), 'progress_percent' => 0]
        );

        $course->load([
            'lessons:id,course_id,title,type,file_url,description,created_at',
            'assignments:id,course_id,title,description,due_date,points_possible',
        ]);

        return response()->json($course);
    }

    
    public function assignments(Request $request)
    {
        $studentId = $request->user()->id;

        $assignments = Assignment::with([
                'course:id,title',
                'submissions' => function ($q) use ($studentId) {
                    $q->where('student_id', $studentId);
                }
            ])
            ->whereHas('course.enrollments', function ($q) use ($studentId) {
                $q->where('user_id', $studentId);
            })
            ->latest('due_date')
            ->get();

        $assignments->transform(function ($assignment) {
            $assignment->student_submission = $assignment->submissions->first();
            unset($assignment->submissions);
            return $assignment;
        });

        return response()->json($assignments);
    }

    
    public function grades(Request $request)
    {
        $studentId = $request->user()->id;

        $submissions = Submission::with([
                'assignment' => function ($query) {
                    $query->select('id', 'course_id', 'title', 'points_possible')
                        ->with(['course:id,title']);
                },
            ])
            ->where('student_id', $studentId)
            ->latest()
            ->get()
            ->filter(fn ($submission) => $submission->assignment && $submission->assignment->course);

        $grouped = $submissions
            ->groupBy(fn ($submission) => $submission->assignment->course_id)
            ->map(function ($courseSubmissions) {
                $course = $courseSubmissions->first()->assignment->course;

                return [
                    'course_id' => $course->id,
                    'course_title' => $course->title,
                    'assignments' => $courseSubmissions->map(function ($submission) {
                        $assignment = $submission->assignment;
                        return [
                            'assignment_id' => $assignment->id,
                            'assignment_title' => $assignment->title,
                            'submitted_at' => $submission->created_at,
                            'status' => $submission->status,
                            'grade' => $submission->grade,
                            'points_possible' => $assignment->points_possible,
                            'feedback' => $submission->feedback,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return response()->json($grouped);
    }

    
    public function submit(Request $request, Assignment $assignment)
    {
        $studentId = $request->user()->id;

        $data = $request->validate([
            'file' => 'required|file|max:51200', // 50MB
        ]);

        $path = $request->file('file')->store('submissions', 'public');
        $fileUrl = Storage::disk('public')->url($path);

        $submission = Submission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $studentId],
            [
                'file_url' => $fileUrl,
                'status' => 'pending',
                'grade' => null,
                'feedback' => null,
            ]
        );

        return response()->json(['submission' => $submission]);
    }
}
