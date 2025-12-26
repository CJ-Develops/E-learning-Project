<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Manage Lessons: {{ $course->title }}
            </h2>
            <a href="{{ route('teacher.courses') }}" class="text-sm text-gray-600 hover:text-gray-900">
                &larr; Back to Courses
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {{-- LEFT COLUMN: List of Existing Lessons --}}
            <div class="md:col-span-2 bg-white shadow-sm sm:rounded-lg p-6">
                <h3 class="text-lg font-bold mb-4">Course Content</h3>
                
                @if($course->lessons->isEmpty())
                    <div class="p-4 bg-yellow-50 text-yellow-700 rounded">
                        No lessons yet. Add your first one!
                    </div>
                @else
                    <ul class="space-y-3">
                        @foreach($course->lessons as $lesson)
                            <li class="flex items-center justify-between bg-gray-50 p-3 rounded border">
                                <span class="font-medium text-gray-700">
                                    {{ $lesson->position }}. {{ $lesson->title }}
                                </span>
                                <span class="text-xs text-gray-500">
                                    {{ $lesson->video_url ? '📹 Video' : '📄 Text' }}
                                </span>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>

            {{-- RIGHT COLUMN: Form to Add New Lesson --}}
            <div class="bg-white shadow-sm sm:rounded-lg p-6 h-fit">
                <h3 class="text-lg font-bold mb-4">Add New Lesson</h3>
                
                <form action="{{ route('teacher.lessons.store', $course->id) }}" method="POST">
                    @csrf
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Lesson Title</label>
                        <input type="text" name="title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Video URL (Optional)</label>
                        <input type="url" name="video_url" placeholder="https://youtube.com/..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Text Content</label>
                        <textarea name="content" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        + Add Lesson
                    </button>
                </form>
            </div>

        </div>
    </div>
</x-app-layout>