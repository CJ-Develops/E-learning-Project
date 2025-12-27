<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Manage Assignments: {{ $course->title }}
            </h2>
            <a href="{{ route('teacher.courses') }}" class="text-sm text-blue-600 hover:underline font-medium">&larr; Back to Courses</a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                {{-- Add New Button --}}
                <div class="flex justify-end mb-6">
                    <a href="{{ route('teacher.assignments.create', $course->id) }}" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 text-sm font-bold">
                        <span>+</span> Add New Assignment
                    </a>
                </div>

                {{-- Assignments List --}}
                @if($course->assignments->isEmpty())
                    <div class="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <p class="text-gray-500 text-lg">No assignments found for this course.</p>
                        <p class="text-gray-400 text-sm mt-1">Click the button above to create the first one.</p>
                    </div>
                @else
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th class="px-6 py-3">Title</th>
                                    <th class="px-6 py-3">Due Date</th>
                                    <th class="px-6 py-3">Submissions</th>
                                    <th class="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($course->assignments as $assignment)
                                    <tr class="bg-white hover:bg-gray-50 transition">
                                        
                                        {{-- Title --}}
                                        <td class="px-6 py-4 font-medium text-gray-900">
                                            {{ $assignment->title }}
                                        </td>
                                        
                                        {{-- Due Date --}}
                                        <td class="px-6 py-4">
                                            {{ $assignment->due_date ?? 'No Due Date' }}
                                        </td>
                                        
                                        {{-- Submissions Count --}}
                                        <td class="px-6 py-4">
                                            <span class="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200">
                                                {{ $assignment->submissions->count() }} Submissions
                                            </span>
                                        </td>
                                        
                                        {{-- Actions --}}
                                        <td class="px-6 py-4 text-right">
                                            <div class="flex justify-end items-center gap-3">
                                                
                                                {{-- View Grades (Green) --}}
                                                <a href="{{ route('teacher.assignments.submissions', $assignment->id) }}" class="text-green-600 hover:text-green-900 font-bold text-xs uppercase tracking-wider hover:underline">
                                                    Grades
                                                </a>

                                                <span class="text-gray-300">|</span>

                                                {{-- Edit Button (Blue/Indigo) --}}
                                                <a href="{{ route('teacher.assignments.edit', $assignment->id) }}" class="text-indigo-600 hover:text-indigo-900 font-bold text-xs uppercase tracking-wider hover:underline">
                                                    Edit
                                                </a>

                                                {{-- Delete Button (Red) --}}
                                                <form action="{{ route('teacher.assignments.destroy', $assignment->id) }}" method="POST" onsubmit="return confirm('Are you sure? This will delete all student submissions for this assignment.');" class="inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:text-red-900 font-bold text-xs uppercase tracking-wider ml-3 hover:underline">
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-app-layout>