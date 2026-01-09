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
   
    public function index(Request $request)
    {
        $teacherId = $request->user()->id;

        $assignments = Assignment::with('course')
            ->where('created_by', $teacherId)
            ->latest()
            ->get();

        return response()->json($assignments);
    }

    
    public function store(Request $request, Course $course)
    {
        
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
            'created_by' => $request->user()->id,
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

    
    public function update(Request $request, Assignment $assignment)
    {
        if ((int) $assignment->created_by !== (int) $request->user()->id) {
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

    
    public function destroy(Request $request, Assignment $assignment)
    {
        if ((int) $assignment->created_by !== (int) $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted']);
    }

    
    public function submissions(Request $request)
    {
        $teacherId = $request->user()->id;

        $submissions = Submission::with(['student', 'assignment'])
            ->whereHas('assignment', function ($q) use ($teacherId) {
                $q->where('created_by', $teacherId);
            })
            ->latest()
            ->get();

        return response()->json($submissions);
    }

    
    public function grade(Request $request, $id)
    {
        $submission = Submission::with('assignment.course')->findOrFail($id);

        if ((int) $submission->assignment->created_by !== (int) $request->user()->id) {
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
