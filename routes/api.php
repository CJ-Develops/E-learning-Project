<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController; // <--- STEP 1: Import the Controller

// --- PUBLIC ROUTES (No Login Required) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// --- PROTECTED ROUTES (Login Required) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Get Current User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // User Management
    Route::apiResource('users', UserController::class);

    // Course Management
    Route::apiResource('courses', CourseController::class); // <--- STEP 2: Add the Route
});