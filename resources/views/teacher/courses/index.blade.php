<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="font-semibold text-2xl text-gray-800 leading-tight">
                    Instructor Dashboard
                </h2>
                <p class="text-sm text-gray-500 mt-1">Welcome back, {{ Auth::user()->name }}!</p>
            </div>
            <a href="{{ route('teacher.courses.create') }}" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Create New Course
            </a>
        </div>
    </x-slot>

    <div class="py-12 bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
            
            {{-- 1. STATS OVERVIEW (Grid Layout) --}}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {{-- Active Courses --}}
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div class="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Courses</div>
                        <div class="text-3xl font-extrabold text-gray-800 mt-1">{{ $totalCourses }}</div>
                    </div>
                    <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                </div>

                {{-- Total Lessons --}}
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Lessons</div>
                        <div class="text-3xl font-extrabold text-indigo-600 mt-1">{{ $totalLessons }}</div>
                    </div>
                    <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                </div>

                {{-- Assignments --}}
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div class="text-gray-400 text-xs font-bold uppercase tracking-wider">Assignments</div>
                        <div class="text-3xl font-extrabold text-purple-600 mt-1">{{ $totalAssignments }}</div>
                    </div>
                    <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </div>
                </div>

                {{-- Needs Grading (Critical) --}}
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between ring-1 {{ $pendingGrades > 0 ? 'ring-orange-100' : 'ring-transparent' }}">
                    <div>
                        <div class="text-gray-400 text-xs font-bold uppercase tracking-wider">Needs Grading</div>
                        <div class="text-3xl font-extrabold {{ $pendingGrades > 0 ? 'text-orange-500' : 'text-green-500' }} mt-1">
                            {{ $pendingGrades }}
                        </div>
                    </div>
                    <div class="p-3 {{ $pendingGrades > 0 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500' }} rounded-lg">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>

            </div>

            {{-- MAIN CONTENT SPLIT --}}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {{-- 2. COURSE LIST (Takes up 2/3 of space) --}}
                <div class="lg:col-span-2">
                    <div class="flex items-center justify-between mb-4">
                        {{-- Switched to text-gray-800 so it is visible on the light background --}}
                        <h3 class="font-bold text-lg text-white mb-4"">My Courses</h3>
                    </div>

                    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        @if($courses->isEmpty())
                            <div class="p-10 text-center text-gray-500">
                                <p>You haven't created any courses yet.</p>
                            </div>
                        @else
                            <table class="w-full text-sm text-left text-gray-500">
                                <thead class="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
                                    <tr>
                                        <th class="px-6 py-4">Course Title</th>
                                        <th class="px-6 py-4 text-center">Stats</th>
                                        <th class="px-6 py-4 text-right">Quick Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    @foreach($courses as $course)
                                        <tr class="hover:bg-gray-50 transition">
                                            <td class="px-6 py-4">
                                                <div class="font-bold text-gray-900 text-base">{{ $course->title }}</div>
                                                <div class="text-xs text-gray-400">Created {{ $course->created_at->diffForHumans() }}</div>
                                            </td>
                                            <td class="px-6 py-4 text-center">
                                                <div class="flex justify-center gap-2">
                                                    <span class="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-100">
                                                        {{ $course->lessons_count }} Lessons
                                                    </span>
                                                    <span class="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold border border-purple-100">
                                                        {{ $course->assignments_count }} Assign.
                                                    </span>
                                                </div>
                                            </td>
                                            {{-- UPDATED QUICK ACTIONS COLUMN --}}
                                            <td class="px-6 py-4 text-right">
                                                <div class="flex justify-end items-center gap-3">
                                                    
                                                    {{-- Lessons Button (Styled Neat) --}}
                                                    <a href="{{ route('teacher.lessons.index', $course->id) }}" 
                                                       class="group flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 transition-all duration-200">
                                                        {{-- Book Icon --}}
                                                        <svg class="w-4 h-4 text-indigo-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                        Manage Lessons
                                                    </a>

                                                    {{-- Divider Line --}}
                                                    <span class="text-gray-200 text-lg font-light">|</span>

                                                    {{-- Edit Icon --}}
                                                    <a href="{{ route('teacher.courses.edit', $course->id) }}" class="text-gray-400 hover:text-indigo-600 transition p-1" title="Edit Course">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </a>

                                                    {{-- Delete Button (FIXED ROUTE HERE) --}}
                                                    <form action="{{ route('teacher.courses.destroy', $course->id) }}" method="POST" class="inline-block" onsubmit="return confirm('Are you sure you want to delete this course?');">
                                                        @csrf
                                                        @method('DELETE')
                                                        <button type="submit" class="text-gray-400 hover:text-red-500 transition p-1" title="Delete Course">
                                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        @endif
                    </div>
                </div>

                {{-- 3. RECENT SUBMISSIONS (Side Panel) --}}
                <div>
                    {{-- Switched to text-gray-800 so it is visible --}}
                    <h3 class="font-bold text-lg text-white mb-4">Recent Activity</h3>
                    <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-0 overflow-hidden">
                        @if($recentSubmissions->isEmpty())
                            <div class="p-8 text-center">
                                <p class="text-gray-400 text-sm italic">No recent activity.</p>
                            </div>
                        @else
                            <div class="divide-y divide-gray-100">
                                @foreach($recentSubmissions as $sub)
                                    <div class="p-4 hover:bg-blue-50 transition group">
                                        <div class="flex items-start gap-3">
                                            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                                {{ substr($sub->user->name, 0, 1) }}
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex justify-between items-start">
                                                    <div class="text-sm font-bold text-gray-900">{{ $sub->user->name }}</div>
                                                    <span class="text-[10px] text-gray-400">{{ $sub->created_at->diffForHumans(null, true) }}</span>
                                                </div>
                                                <div class="text-xs text-gray-500 mt-0.5">
                                                    Submitted <span class="text-blue-600 font-medium">{{ $sub->assignment->title }}</span>
                                                </div>
                                                
                                                {{-- Action Link --}}
                                                <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a href="{{ route('teacher.assignments.submissions', $sub->assignment->id) }}" class="text-[10px] uppercase font-bold text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700">
                                                        Grade Now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @endif
                        <div class="bg-gray-50 p-2 text-center border-t border-gray-100">
                            <span class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Latest Updates</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</x-app-layout>