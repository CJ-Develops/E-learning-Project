<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // 1. GET ALL USERS (Read)
    public function index()
    {
        // Return users ordered by newest first
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    // 2. UPDATE USER (Edit)
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required|integer' // Matching your DB structure (0, 1, 2)
        ]);

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // 3. DELETE USER (Delete)
    public function destroy($id)
    {
        $user = User::find($id);
        
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        }
        
        return response()->json(['message' => 'User not found'], 404);
    }
}