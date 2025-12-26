<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Edit Course: {{ $course->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                
                <form action="{{ route('teacher.courses.update', $course->id) }}" method="POST">
                    @csrf
                    @method('PUT') {{-- Required for Updates --}}
                    
                    {{-- Title --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Course Title</label>
                        <input type="text" name="title" value="{{ $course->title }}" class="w-full border rounded p-2" required>
                    </div>

                    {{-- Description --}}
                    <div class="mb-6">
                        <label class="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea name="description" class="w-full border rounded p-2" rows="5" required>{{ $course->description }}</textarea>
                    </div>

                    {{-- Buttons --}}
                    <div class="flex items-center justify-end gap-4">
                        <a href="{{ route('teacher.courses') }}" class="text-gray-600 hover:text-gray-900">Cancel</a>
                        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            Update Course
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>