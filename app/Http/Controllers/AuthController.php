<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate what the user typed
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required' 
        ]);

        // 2. Check email and password
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = Auth::user();

        if ($user->role !== $request->role) {
            Auth::logout();
            // This will show us exactly what is fighting
            return response()->json([
            'message' => "Mismatch! Database has: '{$user->role}' but Frontend sent: '{$request->role}'"
            ], 403);
        }

        // 4. Create a token (This is the user's "Digital ID Card")
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    // Add this new function to your AuthController class
    public function register(Request $request)
    {
        // 1. Validate the input
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email', // Check if email already exists
            'password' => 'required|string|min:6',
            'role' => 'required|string'
        ]);

        // 2. Create the User
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
            'role' => $fields['role']
        ]);

        // 3. Create a Token (Log them in immediately)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }








}



