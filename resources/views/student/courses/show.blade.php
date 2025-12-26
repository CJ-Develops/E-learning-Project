<x-app-layout>
    <div class="py-12 bg-gray-100 min-h-screen">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            {{-- GRID LAYOUT: Video Left (2/3), Playlist Right (1/3) --}}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {{-- LEFT COLUMN: Video Player & Content --}}
                <div class="lg:col-span-2">
                    
                    {{-- 1. The Video Player --}}
                    <div class="bg-black rounded-xl shadow-lg overflow-hidden aspect-video relative">
                        @if($currentLesson && $currentLesson->video_url)
                            <iframe 
                                class="w-full h-full" 
                                src="{{ str_replace('watch?v=', 'embed/', $currentLesson->video_url) }}" 
                                title="Course Video"
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        @else
                            {{-- Placeholder if no video --}}
                            <div class="flex items-center justify-center h-full text-white bg-gray-900">
                                <div class="text-center p-6">
                                    <p class="text-lg font-semibold text-gray-300">📄 Reading Lesson</p>
                                </div>
                            </div>
                        @endif
                    </div>

                    {{-- 2. Lesson Title & Description --}}
                    <div class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">
                            {{ $currentLesson->title ?? 'Welcome to the Course' }}
                        </h1>
                        <p class="text-sm text-gray-500 mb-6">
                            Lesson {{ $currentLesson->position ?? 0 }} of {{ $course->lessons->count() }}
                        </p>
                        
                        <div class="prose max-w-none text-gray-700">
                            {{ $currentLesson->content ?? 'No text content provided.' }}
                        </div>
                    </div>

                </div>

                {{-- RIGHT COLUMN: Playlist / Sidebar --}}
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                        
                        {{-- Sidebar Header --}}
                        <div class="bg-gray-50 p-4 border-b border-gray-200">
                            <h3 class="font-bold text-lg text-gray-800">{{ $course->title }}</h3>
                            <p class="text-xs text-gray-500">{{ $course->lessons->count() }} Lessons</p>
                        </div>

                        {{-- Lesson List --}}
                        <ul class="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                            @foreach($course->lessons as $lesson)
                                <li>
                                    <a href="#" class="block p-4 hover:bg-blue-50 transition {{ isset($currentLesson) && $currentLesson->id == $lesson->id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent' }}">
                                        <div class="flex items-center gap-3">
                                            <span class="text-xs font-bold text-gray-400 bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full">
                                                {{ $loop->iteration }}
                                            </span>
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-900">{{ $lesson->title }}</h4>
                                                <span class="text-xs text-gray-500">
                                                    {{ $lesson->video_url ? '📹 Video' : '📄 Text' }}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            @endforeach
                        </ul>

                        {{-- 👇 NEW SECTION: Assignments --}}
                        <div class="bg-gray-50 border-t border-gray-200 p-4">
                            <h4 class="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wider">Assignments</h4>
                            
                            @if($course->assignments->count() > 0)
                                <ul class="space-y-2">
                                    @foreach($course->assignments as $assignment)
                                        <li>
                                            <a href="{{ route('assignments.show', $assignment->id) }}" class="block bg-white border border-gray-200 p-3 rounded-lg hover:shadow-md hover:border-blue-300 transition flex items-center justify-between group">
                                                <div class="flex items-center gap-2">
                                                    <span class="text-blue-500">📝</span>
                                                    <span class="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                                                        {{ $assignment->title }}
                                                    </span>
                                                </div>
                                                <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                            </a>
                                        </li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-xs text-gray-400 italic">No assignments for this course.</p>
                            @endif
                        </div>
                        {{-- 👆 END NEW SECTION --}}

                    </div>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>