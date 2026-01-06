<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Submission;
use App\Notifications\NewAssignment;
use App\Notifications\SubmissionGraded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeacherAssignmentController extends Controller
{
    // GET /api/teacher/assignments
    public function index(Request $request)
    {
        $teacherId = $request->user()->id;

        $assignments = Assignment::with('course')
            ->whereHas('course', function ($q) use ($teacherId) {
                $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                    $teacherQuery->where('users.id', $teacherId);
                });
            })
            ->latest()
            ->get();

        return response()->json($assignments);
    }

    // POST /api/courses/{course}/assignments
    public function store(Request $request, Course $course)
    {
        // Ensure the teacher owns this course
        $isAssignedTeacher = $course->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'points_possible' => 'nullable|integer|min:1|max:100',
        ]);

        $assignment = $course->assignments()->create([
            ...$data,
            'points_possible' => $data['points_possible'] ?? 100,
        ]);

        $course->students()
            ->select('users.id')
            ->chunkById(200, function ($students) use ($assignment) {
                foreach ($students as $student) {
                    $student->notify(new NewAssignment($assignment->title));
                }
            });

        return response()->json(['assignment' => $assignment], 201);
    }

    // PUT /api/assignments/{assignment}
    public function update(Request $request, Assignment $assignment)
    {
        $isAssignedTeacher = $assignment->course
            ->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'points_possible' => 'nullable|integer|min:1|max:100',
        ]);

        $assignment->update([
            'title' => $data['title'] ?? $assignment->title,
            'description' => array_key_exists('description', $data) ? $data['description'] : $assignment->description,
            'due_date' => $data['due_date'] ?? $assignment->due_date,
            'points_possible' => $data['points_possible'] ?? $assignment->points_possible,
        ]);

        return response()->json(['assignment' => $assignment]);
    }

    // DELETE /api/assignments/{assignment}
    public function destroy(Request $request, Assignment $assignment)
    {
        $isAssignedTeacher = $assignment->course
            ->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted']);
    }

    // GET /api/teacher/submissions
    public function submissions(Request $request)
    {
        $teacherId = $request->user()->id;

        $submissions = Submission::with(['student', 'assignment'])
            ->whereHas('assignment.course', function ($q) use ($teacherId) {
                $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                    $teacherQuery->where('users.id', $teacherId);
                });
            })
            ->latest()
            ->get();

        return response()->json($submissions);
    }

    // POST /api/submissions/{id}/grade
    public function grade(Request $request, $id)
    {
        $submission = Submission::with('assignment.course')->findOrFail($id);

        // Only the course's teacher can grade
        $isAssignedTeacher = $submission->assignment->course
            ->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'grade' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string',
            'status' => 'nullable|in:pending,graded',
        ]);

        $submission->update([
            'grade' => $data['grade'],
            'feedback' => $data['feedback'] ?? null,
            'status' => $data['status'] ?? 'graded',
        ]);

        if ($submission->student) {
            $maxScore = $submission->assignment->points_possible ?? 100;
            $submission->student->notify(new SubmissionGraded(
                $submission->assignment->title,
                $submission->grade,
                $maxScore
            ));
        }

        return response()->json(['submission' => $submission]);
    }
}
