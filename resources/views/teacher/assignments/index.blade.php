<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Manage Assignments: {{ $course->title }}
            </h2>
            <a href="{{ route('teacher.courses') }}" class="text-sm text-blue-600 hover:underline">&larr; Back to Courses</a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                {{-- Add New Button --}}
                <div class="flex justify-end mb-6">
                    <a href="{{ route('teacher.assignments.create', $course->id) }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2">
                        <span>+</span> Add New Assignment
                    </a>
                </div>

                {{-- Assignments List --}}
                @if($course->assignments->isEmpty())
                    <p class="text-gray-500 text-center py-10">No assignments found.</p>
                @else
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th class="px-6 py-3">Title</th>
                                <th class="px-6 py-3">Due Date</th>
                                <th class="px-6 py-3">Submissions</th>
                                <th class="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($course->assignments as $assignment)
                                <tr class="bg-white border-b hover:bg-gray-50">
                                    <td class="px-6 py-4 font-medium text-gray-900">{{ $assignment->title }}</td>
                                    <td class="px-6 py-4">{{ $assignment->due_date ?? 'None' }}</td>
                                    <td class="px-6 py-4">
                                        <span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                                            {{ $assignment->submissions->count() }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right flex justify-end gap-3">
                                        {{-- View Grades Button --}}
                                        <a href="{{ route('teacher.assignments.submissions', $assignment->id) }}" class="text-indigo-600 hover:text-indigo-900 font-medium">
                                            View Grades
                                        </a>

                                        {{-- Delete Button --}}
                                        <form action="{{ route('teacher.assignments.destroy', $assignment->id) }}" method="POST" onsubmit="return confirm('Are you sure? This will delete all student submissions for this assignment.');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-900 font-bold">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            </div>
        </div>
    </div>
</x-app-layout>