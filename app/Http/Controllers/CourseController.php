<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // ==========================================
    // TEACHER FUNCTIONS
    // ==========================================

    // 1. Show the list of courses (Teacher Dashboard)
    public function index()
    {
        // Fetch only courses created by the currently logged-in teacher
        $courses = \App\Models\Course::where('instructor_id', auth()->id())->get();

        // Return the TEACHER view
        return view('teacher.courses.index', compact('courses'));
    }

    // 2. Show the "Create Course" Form
    public function create()
    {
        return view('teacher.courses.create');
    }

    // 3. Save the Course to Database
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            // 'price' removed since you don't use it
        ]);

        Course::create([
            'instructor_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('teacher.courses')->with('success', 'Course created successfully!');
    }

    // 4. Show the Edit Form
    public function edit(Course $course)
    {
        return view('teacher.courses.edit', compact('course'));
    }

    // 5. Update the Course
    public function update(Request $request, Course $course)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $course->update($request->all());

        return redirect()->route('teacher.courses')->with('success', 'Course updated successfully!');
    }

    // 6. Delete the Course
    public function destroy(Course $course)
    {
        $course->delete();
        return back()->with('success', 'Course deleted successfully!');
    }


    // ==========================================
    // STUDENT FUNCTIONS
    // ==========================================

    // 1. Student Dashboard: Catalog of Courses + Widgets
    public function catalog()
    {
        $userId = auth()->id();

        // Fetch Courses with Assignments & Submissions for the current user
        $courses = \App\Models\Course::with(['lessons', 'assignments' => function($query) use ($userId) {
            $query->with(['submissions' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }])->get();

        // Calculate Widgets (Due Soon / Recent Grades)
        $pendingAssignments = collect();
        $recentGrades = collect();

        foreach ($courses as $course) {
            foreach ($course->assignments as $assignment) {
                $submission = $assignment->submissions->first();

                // If no submission, it's PENDING
                if (!$submission) {
                    $assignment->course_title = $course->title; 
                    $pendingAssignments->push($assignment);
                } 
                // If submitted AND graded, add to GRADES list
                elseif ($submission->grade !== null) {
                    $submission->assignment_title = $assignment->title;
                    $submission->course_title = $course->title;
                    $recentGrades->push($submission);
                }
            }
        }

        // Sort the lists
        $pendingAssignments = $pendingAssignments->sortBy('due_date')->take(3);
        $recentGrades = $recentGrades->sortByDesc('created_at')->take(3);

        // Return the STUDENT view
        return view('student.courses.index', compact('courses', 'pendingAssignments', 'recentGrades'));
    }

    // 2. Show the course content (Lessons) to a student
    public function show(Course $course)
    {
        $currentLesson = $course->lessons()->orderBy('position')->first();
        
        return view('student.courses.show', compact('course', 'currentLesson'));
    }
}