<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    public function index($courseId)
    {
        $course = Course::findOrFail($courseId);

        // Ensure the authenticated teacher owns this course
        $isAssignedTeacher = $course->teachers()
            ->where('users.id', auth()->id())
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        return response()->json(
            $course->lessons()->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:link,file',
            'file' => 'required_if:type,file|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:51200',
            'file_url' => 'required_if:type,link|url',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        $isAssignedTeacher = $course->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        // Determine file_url based on type
        $fileUrl = null;
        if ($validated['type'] === 'file') {
            $path = $request->file('file')->store('lessons', 'public');
            $fileUrl = Storage::disk('public')->url($path);
        } else {
            $fileUrl = $validated['file_url'];
        }

        $lesson = Lesson::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'file_url' => $fileUrl,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json(['lesson' => $lesson], 201);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $course = Course::findOrFail($lesson->course_id);
        $isAssignedTeacher = $course->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:link,file',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:51200', // optional replace
            'file_url' => 'nullable|url',
        ]);

        $type = $validated['type'] ?? $lesson->type;
        $fileUrl = $lesson->file_url;

        if ($type === 'file') {
            if ($request->hasFile('file')) {
                $path = $request->file('file')->store('lessons', 'public');
                $fileUrl = Storage::disk('public')->url($path);
            }
            // keep existing file if no new upload
        } else { // youtube
            if (!empty($validated['file_url'])) {
                $fileUrl = $validated['file_url'];
            }
        }

        $lesson->update([
            'title' => $validated['title'] ?? $lesson->title,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $lesson->description,
            'type' => $type,
            'file_url' => $fileUrl,
        ]);

        return response()->json(['lesson' => $lesson]);
    }

    public function destroy(Request $request, Lesson $lesson)
    {
        $course = Course::findOrFail($lesson->course_id);
        $isAssignedTeacher = $course->teachers()
            ->where('users.id', $request->user()->id)
            ->exists();
        if (!$isAssignedTeacher) {
            abort(403, 'Unauthorized');
        }

        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted']);
    }
}
