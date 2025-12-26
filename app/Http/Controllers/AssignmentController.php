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
    public function submissions(Assignment $assignment)
    {
        // Load the assignment with its submissions and the students who submitted
        $assignment->load('submissions.user'); 
        
        return view('teacher.assignments.submissions', compact('assignment'));
    }

    // 4. Save a Grade
    public function grade(Request $request, \App\Models\Submission $submission)
    {
        $request->validate([
            'grade' => 'required|integer|min:0|max:100'
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
}