<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Edit Assignment: {{ $assignment->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                
                <form action="{{ route('teacher.assignments.update', $assignment->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    {{-- Title --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Assignment Title</label>
                        <input type="text" name="title" value="{{ $assignment->title }}" class="w-full border-gray-300 rounded shadow-sm" required>
                    </div>

                    {{-- Description --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Instructions</label>
                        <textarea name="description" class="w-full border-gray-300 rounded shadow-sm" rows="4" required>{{ $assignment->description }}</textarea>
                    </div>

                    {{-- Due Date & Points --}}
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Due Date</label>
                            <input type="datetime-local" name="due_date" value="{{ $assignment->due_date }}" class="w-full border-gray-300 rounded shadow-sm" required>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Points</label>
                            <input type="number" name="points" value="{{ $assignment->points }}" class="w-full border-gray-300 rounded shadow-sm" required>
                        </div>
                    </div>

                    {{-- Buttons --}}
                    <div class="flex justify-end gap-4">
                        <a href="{{ route('teacher.assignments.index', $assignment->course_id) }}" class="text-gray-500 hover:underline py-2">Cancel</a>
                        <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
                            Update Assignment
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>