<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController; // <--- IMPORT THIS
use App\Http\Controllers\LessonController;
use App\Http\Controllers\TeacherAssignmentController;
use App\Http\Controllers\StudentCourseController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\AdminEnrollmentController;
use App\Http\Controllers\NotificationController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markRead']);
    
    Route::apiResource('users', UserController::class);
    Route::apiResource('courses', CourseController::class); // <--- ADD THIS
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);

    // Assignments & grading
    Route::get('/teacher/assignments', [TeacherAssignmentController::class, 'index']);
    Route::post('/courses/{course}/assignments', [TeacherAssignmentController::class, 'store']);
    Route::put('/assignments/{assignment}', [TeacherAssignmentController::class, 'update']);
    Route::delete('/assignments/{assignment}', [TeacherAssignmentController::class, 'destroy']);
    Route::get('/teacher/submissions', [TeacherAssignmentController::class, 'submissions']);
    Route::post('/submissions/{id}/grade', [TeacherAssignmentController::class, 'grade']);
    Route::get('/courses/{course}/students', [CourseController::class, 'students']);

    // Student-facing
    Route::get('/student/courses', [StudentCourseController::class, 'index']);
    Route::get('/student/courses/{course}', [StudentCourseController::class, 'show']);
    Route::get('/student/assignments', [StudentCourseController::class, 'assignments']);
    Route::get('/student/grades', [StudentCourseController::class, 'grades']);
    Route::post('/assignments/{assignment}/submit', [StudentCourseController::class, 'submit']);

    // Admin dashboard
    Route::get('/admin/dashboard-stats', [AdminDashboardController::class, 'index']);

    // Teacher dashboard
    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index']);

    // Admin enrollment
    Route::get('/admin/enrollments', [AdminEnrollmentController::class, 'index']);
    Route::post('/admin/enroll', [AdminEnrollmentController::class, 'store']);
    Route::post('/admin/drop-course', [AdminEnrollmentController::class, 'destroy']);
});
