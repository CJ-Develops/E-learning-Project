<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Manage Courses') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            {{-- Header --}}
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-medium text-gray-900">My Courses</h3>
                <a href="{{ route('teacher.courses.create') }}" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
                    <span>+</span> Create New Course
                </a>
            </div>

            {{-- Course Table --}}
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th class="px-6 py-3">Course Title</th>
                                    <th class="px-6 py-3">Content</th>
                                    <th class="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($courses as $course)
                                    <tr class="bg-white hover:bg-gray-50 transition">
                                        {{-- Title & Edit/Delete --}}
                                        <td class="px-6 py-4 font-medium text-gray-900 align-top">
                                            <div class="text-base font-bold">{{ $course->title }}</div>
                                            <div class="text-xs text-gray-400 mt-1 mb-2">Created: {{ $course->created_at->format('M d, Y') }}</div>
                                            
                                            {{-- 👇 FIXED: Always Visible + Forced Colors --}}
                                            <div class="flex gap-4 mt-2">
                                                {{-- Edit Link (Blue) --}}
                                                <a href="{{ route('teacher.courses.edit', $course->id) }}" 
                                                   class="text-xs font-bold hover:underline"
                                                   style="color: #2563eb;"> {{-- Forced Blue --}}
                                                    ✏️ Edit
                                                </a>

                                                {{-- Delete Form (Red) --}}
                                                <form action="{{ route('teacher.courses.destroy', $course->id) }}" method="POST" onsubmit="return confirm('Are you sure? This will delete the course and ALL its lessons/assignments.');" class="inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" 
                                                            class="text-xs font-bold hover:underline"
                                                            style="color: #dc2626;"> {{-- Forced Red --}}
                                                        🗑️ Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                        
                                        {{-- Content Stats --}}
                                        <td class="px-6 py-4 align-top">
                                            <div class="flex flex-col gap-2">
                                                <span class="inline-flex items-center gap-2 text-xs text-gray-600">
                                                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                    {{ $course->lessons->count() }} Lessons
                                                </span>
                                                <span class="inline-flex items-center gap-2 text-xs text-gray-600">
                                                    <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                                                    {{ $course->assignments->count() }} Assignments
                                                </span>
                                            </div>
                                        </td>

                                        {{-- Main Actions --}}
                                        <td class="px-6 py-4 text-right align-top">
                                            <div class="flex justify-end gap-2">
                                                
                                                {{-- Manage Lessons --}}
                                                <a href="{{ route('teacher.lessons.index', $course->id) }}" 
                                                   class="text-white px-3 py-2 rounded text-xs font-bold uppercase tracking-wider hover:opacity-90 transition shadow-sm"
                                                   style="background-color: #4f46e5;"> 
                                                    Manage Lessons
                                                </a>

                                                {{-- Manage Assignments --}}
                                                <a href="{{ route('teacher.assignments.index', $course->id) }}" 
                                                   class="text-white px-3 py-2 rounded text-xs font-bold uppercase tracking-wider hover:opacity-90 transition shadow-sm"
                                                   style="background-color: #f97316;">
                                                    Manage Assignments
                                                </a>

                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>

                    @if($courses->isEmpty())
                        <div class="text-center py-12 text-gray-500">
                            No courses yet. Click "Create New Course" to start.
                        </div>
                    @endif

                </div>
            </div>
        </div>
    </div>
</x-app-layout>