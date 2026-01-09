<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 

class UserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::with([
                'courses:id,title',
                'teachingCourses:id,title',
            ])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6', 
            'role' => 'required|integer'
        ]);

       
        $validated['password'] = Hash::make($validated['password']);

        // 3. Create the user
        $user = User::create($validated);

        
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
