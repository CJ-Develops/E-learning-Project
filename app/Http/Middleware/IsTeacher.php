<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsTeacher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is logged in
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Check if role is Teacher (1) or Admin (2)
        // 0 = Student, 1 = Teacher, 2 = Admin
        if (auth()->user()->role == 1 || auth()->user()->role == 2) {
            return $next($request);
        }

        // If not a teacher, show a 403 Forbidden error
        abort(403, 'Unauthorized action. Teachers only.');
    }
}