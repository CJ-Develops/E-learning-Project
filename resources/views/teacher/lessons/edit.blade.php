<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Edit Lesson: {{ $lesson->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                
                <div class="p-6 bg-white border-b border-gray-100">
                    <form action="{{ route('teacher.lessons.update', $lesson->id) }}" method="POST">
                        @csrf
                        @method('PUT')

                        <div class="grid grid-cols-1 gap-6 mb-6">
                            
                            {{-- Title --}}
                            <div>
                                <label class="block text-gray-700 font-bold mb-2 text-sm uppercase">Lesson Title</label>
                                <input type="text" name="title" value="{{ $lesson->title }}" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                            </div>

                            {{-- Video URL (Added!) --}}
                            <div>
                                <label class="block text-gray-700 font-bold mb-2 text-sm uppercase">Video URL (Optional)</label>
                                <input type="url" name="video_url" value="{{ $lesson->video_url }}" placeholder="https://youtube.com/..." class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <p class="text-xs text-gray-400 mt-1">If you entered the wrong link, just paste the new one here.</p>
                            </div>

                            {{-- Content --}}
                            <div>
                                <label class="block text-gray-700 font-bold mb-2 text-sm uppercase">Lesson Content</label>
                                <textarea name="content" rows="8" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">{{ $lesson->content }}</textarea>
                            </div>
                        </div>

                        {{-- Buttons --}}
                        <div class="flex justify-end gap-4 bg-gray-50 -m-6 p-6 mt-0 border-t border-gray-100">
                            <a href="{{ route('teacher.lessons.index', $lesson->course_id) }}" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition">
                                Cancel
                            </a>
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 transition">
                                Update Lesson
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>