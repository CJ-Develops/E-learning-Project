<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create an ADMIN (Role 2)
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@lms.com',
            'password' => Hash::make('password'),
            'role' => 2,
        ]);

        // 2. Create a TEACHER (Role 1)
        User::create([
            'name' => 'Prof. Snape',
            'email' => 'teacher@lms.com',
            'password' => Hash::make('password'),
            'role' => 1,
        ]);

        // 3. Create a STUDENT (Role 0)
        User::create([
            'name' => 'Harry Potter',
            'email' => 'student@lms.com',
            'password' => Hash::make('password'),
            'role' => 0,
        ]);
    }
}