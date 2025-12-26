<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubmissionController;

// 1. Homepage
Route::get('/', function () {
    return view('welcome');
});

// 2. Dashboard
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 3. Student & Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/my-courses', function () {
        return "<h1>🎓 Student Course List</h1>";
    })->name('student.courses');

    // Student: Catalog (See all courses)
    Route::get('/courses', [CourseController::class, 'catalog'])->name('courses.index');

    // Student: Watch Course
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');

    // Student: Assignments
    Route::get('/assignments/{assignment}', [SubmissionController::class, 'show'])->name('assignments.show');
    Route::post('/assignments/{assignment}/submit', [SubmissionController::class, 'submit'])->name('assignments.submit');
});

// 4. Teacher Routes
Route::middleware(['auth', 'teacher'])->prefix('teacher')->group(function () {

    // 👇 ADD THIS NEW LINE HERE (To show the list of courses)
    Route::get('/courses', [CourseController::class, 'index'])->name('teacher.courses');

    // Show the Create Form
    Route::get('/courses/create', [CourseController::class, 'create'])->name('teacher.courses.create');

    // Save the data
    Route::post('/courses', [CourseController::class, 'store'])->name('teacher.courses.store');

    // Show Lesson Manager
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index'])->name('teacher.lessons.index');

    // Save a New Lesson
    Route::post('/courses/{course}/lessons', [LessonController::class, 'store'])->name('teacher.lessons.store');

    // Assignments
    Route::get('/courses/{course}/assignments/create', [AssignmentController::class, 'create'])->name('teacher.assignments.create');
    Route::post('/courses/{course}/assignments', [AssignmentController::class, 'store'])->name('teacher.assignments.store');

    // Grading
    Route::get('/assignments/{assignment}/submissions', [AssignmentController::class, 'submissions'])->name('teacher.assignments.submissions');
    Route::post('/submissions/{submission}/grade', [AssignmentController::class, 'grade'])->name('teacher.grade.store');

    Route::get('/courses/{course}/assignments', [AssignmentController::class, 'index'])->name('teacher.assignments.index');
    Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy'])->name('teacher.assignments.destroy');

    // Edit & Update
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->name('teacher.courses.edit');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->name('teacher.courses.update');
    
    // Delete
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('teacher.courses.destroy');


});

// 5. Auth Routes (This file now exists!)
require __DIR__.'/auth.php';