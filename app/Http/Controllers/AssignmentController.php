<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    // 1. Show the "Create Assignment" Form
    public function create(Course $course)
    {
        return view('teacher.assignments.create', compact('course'));
    }

    // 2. Store the Assignment
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'due_date' => 'nullable|date',
        ]);

        $course->assignments()->create($request->all());

        return redirect()->route('teacher.courses')->with('success', 'Assignment added!');
    }

    // 3. View Submissions for an Assignment
    // VIEW SUBMISSIONS (Grading Page)
    public function submissions(\App\Models\Assignment $assignment)
    {
        // Fetch all submissions for this assignment, including the student's name (user)
        $submissions = $assignment->submissions()->with('user')->get();

        return view('teacher.assignments.submissions', compact('assignment', 'submissions'));
    }

    // 4. Save a Grade
    public function grade(Request $request, \App\Models\Submission $submission)
    {
        $request->validate([
            // 👇 THIS LINE ENSURES THE GRADE IS BETWEEN 0 AND 100
            'grade' => 'required|integer|min:0|max:100',
        ]);

        $submission->update(['grade' => $request->grade]);

        return back()->with('success', 'Grade saved successfully!');
    }
    // 5. List all assignments for a course
    public function index(Course $course)
    {
        return view('teacher.assignments.index', compact('course'));
    }

    // 6. Delete an assignment
    public function destroy(Assignment $assignment)
    {
        $assignment->delete();
        return back()->with('success', 'Assignment deleted successfully!');
    }

    // 7. SHOW EDIT FORM
    public function edit(Assignment $assignment)
    {
        return view('teacher.assignments.edit', compact('assignment'));
    }

    // 8. UPDATE ASSIGNMENT
    public function update(Request $request, Assignment $assignment)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'points' => 'required|integer|min:0',
        ]);

        $assignment->update($request->all());

        // Redirect back to the Assignment List for the course
        return redirect()->route('teacher.assignments.index', $assignment->course_id)
                         ->with('success', 'Assignment updated successfully!');
    }
}