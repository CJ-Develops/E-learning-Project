<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // <--- IMPORTANT: Add this line

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    // --- ADD THIS NEW METHOD ---
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6', // Password is required for new users
            'role' => 'required|integer'
        ]);

        // 2. Hash the password before saving
        $validated['password'] = Hash::make($validated['password']);

        // 3. Create the user
        $user = User::create($validated);

        // 4. Return the new user so the frontend can display it immediately
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }
    // ---------------------------

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required|integer'
        ]);

        $user->update($validated);

        return response()->json(['message' => 'User updated', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted']);
        }
        return response()->json(['message' => 'User not found'], 404);
    }
}