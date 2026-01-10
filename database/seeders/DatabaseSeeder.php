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
            'password' => Hash::make('password'),
            'role' => 2, 
        ]);

        // 2. Teacher User
        User::create([
            'name' => 'Prof. Snape',
            'email' => 'teacher@lms.com',
            'password' => Hash::make('password'),
            'role' => 1, 
        ]);

        // 3. Student User
        User::create([
            'name' => 'Harry Potter',
            'email' => 'student@lms.com',
            'password' => Hash::make('password'),
            'role' => 0, 
        ]);
    }
}