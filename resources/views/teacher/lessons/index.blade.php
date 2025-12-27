<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Lessons
                </h2>
                <p class="text-sm text-gray-500 mt-1">Course: {{ $course->title }}</p>
            </div>
            <a href="{{ route('teacher.courses') }}" class="text-sm text-white hover:underline font-bold">&larr; Back to Courses</a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            
            {{-- 1. ADD NEW LESSON FORM --}}
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                <div class="p-4 bg-gray-50 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">+</span>
                        Add New Lesson
                    </h3>
                </div>
                
                <div class="p-6 bg-white">
                    <form action="{{ route('teacher.lessons.store', $course->id) }}" method="POST">
                        @csrf
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {{-- Title --}}
                            <div>
                                <label class="block text-gray-700 font-bold mb-2 text-sm uppercase">Lesson Title</label>
                                <input type="text" name="title" placeholder="e.g., Introduction to PHP" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                            </div>

                            {{-- Video URL --}}
                            <div>
                                <label class="block text-gray-700 font-bold mb-2 text-sm uppercase">Video URL (Optional)</label>
                                <input type="url" name="video_url" placeholder="https://youtube.com/..." class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            </div>
                        </div>

                        {{-- Content --}}
                        <div class="mb-6">
                            <label class="block text-gray-700 font-bold mb-2 text-sm uppercase">Description / Content</label>
                            <textarea name="content" rows="3" placeholder="Brief summary of this lesson..." class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                        </div>

                        {{-- SAVE BUTTON (Fixed Color: Blue) --}}
                        <div class="flex justify-end">
                            <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                                Save Lesson
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {{-- 2. CURRENT LESSONS LIST --}}
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-lg text-gray-800">Current Lessons</h3>
                    <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{{ $course->lessons->count() }} Total</span>
                </div>

                @if($course->lessons->isEmpty())
                    <div class="p-12 text-center">
                        <div class="inline-block p-4 rounded-full bg-gray-50 mb-4">
                            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900">No lessons yet</h3>
                        <p class="text-gray-500 mt-1">Start by adding your first lesson above.</p>
                    </div>
                @else
                    <div class="divide-y divide-gray-100">
                        @foreach($course->lessons as $lesson)
                            <div class="p-4 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                                
                                {{-- Lesson Info --}}
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0 mt-1">
                                        <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                            {{ $loop->iteration }}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">{{ $lesson->title }}</h4>
                                        <p class="text-sm text-gray-500 line-clamp-1">{{ $lesson->content ?? 'No description' }}</p>
                                        @if($lesson->video_url)
                                            <a href="{{ $lesson->video_url }}" target="_blank" class="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                                                Watch Video
                                            </a>
                                        @endif
                                    </div>
                                </div>

                                {{-- Actions --}}
                                <div class="flex items-center gap-3">
                                    <a href="{{ route('teacher.lessons.edit', $lesson->id) }}" class="text-sm text-indigo-600 hover:text-indigo-900 font-bold bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition">
                                        Edit
                                    </a>

                                    <form action="{{ route('teacher.lessons.destroy', $lesson->id) }}" method="POST" onsubmit="return confirm('Delete this lesson?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-sm text-red-600 hover:text-red-900 font-bold bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 transition">
                                            Delete
                                        </button>
                                    </form>
                                </div>

                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

        </div>
    </div>
</x-app-layout>