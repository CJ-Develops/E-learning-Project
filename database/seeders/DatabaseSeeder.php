<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@lms.com',
            'password' => Hash::make('password'), // Login password is "password"
            'role' => 2, // 2 = Admin
        ]);

        // 2. Teacher User
        User::create([
            'name' => 'Prof. Snape',
            'email' => 'teacher@lms.com',
            'password' => Hash::make('password'),
            'role' => 1, // 1 = Teacher
        ]);

        // 3. Student User
        User::create([
            'name' => 'Harry Potter',
            'email' => 'student@lms.com',
            'password' => Hash::make('password'),
            'role' => 0, // 0 = Student
        ]);
    }
}