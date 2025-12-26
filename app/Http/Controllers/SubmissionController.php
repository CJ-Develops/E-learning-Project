<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    // 1. Show the Assignment Details & Submission Form
    public function show(Assignment $assignment)
    {
        // Check if student already submitted
        $existingSubmission = Submission::where('assignment_id', $assignment->id)
            ->where('user_id', auth()->id())
            ->first();

        // Pass data to the view
        return view('student.assignments.show', compact('assignment', 'existingSubmission'));
    }

    // 2. Handle the File Upload
    public function submit(Request $request, Assignment $assignment)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,zip|max:10240', // Max 10MB
        ]);

        // Upload the file to the 'submissions' folder in public disk
        $path = $request->file('file')->store('submissions', 'public');

        // Save record to Database
        Submission::create([
            'assignment_id' => $assignment->id,
            'user_id' => auth()->id(),
            'file_path' => $path,
        ]);

        return back()->with('success', 'Assignment submitted successfully!');
    }
}