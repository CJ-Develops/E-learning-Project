<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Add Assignment to: {{ $course->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                
                <form action="{{ route('teacher.assignments.store', $course->id) }}" method="POST">
                    @csrf
                    
                    {{-- Title --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Assignment Title</label>
                        <input type="text" name="title" class="w-full border rounded p-2 focus:ring focus:ring-blue-200" placeholder="e.g., Database Design Project" required>
                    </div>

                    {{-- Instructions --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Instructions</label>
                        <textarea name="description" class="w-full border rounded p-2 focus:ring focus:ring-blue-200" rows="5" placeholder="Describe what the student needs to do..." required></textarea>
                    </div>

                    {{-- Due Date --}}
                    <div class="mb-6">
                        <label class="block text-gray-700 font-bold mb-2">Due Date (Optional)</label>
                        <input type="date" name="due_date" class="w-full border rounded p-2 focus:ring focus:ring-blue-200">
                    </div>

                    {{-- Buttons --}}
                    <div class="flex items-center justify-end gap-4">
                        <a href="{{ route('teacher.courses') }}" class="text-gray-600 hover:text-gray-900">Cancel</a>
                        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            Create Assignment
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>