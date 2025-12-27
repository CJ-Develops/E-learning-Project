<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // 1. SYSTEM OVERVIEW (Dashboard)
    public function dashboard()
    {
        // Fetch stats for the dashboard cards
        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalStudents = User::where('role', 'student')->count();
        $totalTeachers = User::where('role', 'teacher')->count();

        return view('admin.dashboard', compact('totalUsers', 'totalCourses', 'totalStudents', 'totalTeachers'));
    }

    // 2. USER MANAGEMENT (List Users)
    public function users()
    {
        $users = User::all();
        return view('admin.users.index', compact('users'));
    }

    // 3. SHOW CREATE FORM
    public function createUser()
    {
        return view('admin.users.create');
    }

    // 4. STORE NEW USER
    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:student,teacher,admin', // RBAC: Role Selection
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.users')->with('success', 'User created successfully!');
    }

    // 5. DELETE USER
    public function destroyUser(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted successfully!');
    }

    // 6. SHOW EDIT FORM
    public function editUser(User $user)
    {
        return view('admin.users.edit', compact('user'));
    }

    // 7. UPDATE USER
    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'role' => 'required|in:student,teacher,admin',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        // Only update password if a new one is provided
        if ($request->filled('password')) {
            $request->validate(['password' => 'min:8']);
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users')->with('success', 'User updated successfully!');
    }
}