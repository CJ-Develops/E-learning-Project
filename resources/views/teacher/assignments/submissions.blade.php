<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Submissions for: {{ $assignment->title }}
            </h2>
            <a href="{{ route('teacher.courses') }}" class="text-sm text-blue-600 hover:underline">&larr; Back to Courses</a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    
                    @if($assignment->submissions->isEmpty())
                        <div class="text-center py-10 text-gray-500">
                            <p class="text-lg">No students have submitted this assignment yet.</p>
                        </div>
                    @else
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th class="px-6 py-3">Student Name</th>
                                        <th class="px-6 py-3">Submission Date</th>
                                        <th class="px-6 py-3">File</th>
                                        <th class="px-6 py-3 text-center">Grading</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    @foreach($assignment->submissions as $submission)
                                        <tr class="bg-white hover:bg-gray-50 transition">
                                            {{-- Student Name --}}
                                            <td class="px-6 py-4">
                                                <div class="font-medium text-gray-900">{{ $submission->user->name }}</div>
                                                <div class="text-xs text-gray-400">{{ $submission->user->email }}</div>
                                            </td>
                                            
                                            {{-- Date --}}
                                            <td class="px-6 py-4">
                                                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {{ $submission->created_at->format('M d, Y') }}
                                                </span>
                                                <div class="text-xs text-gray-400 mt-1">{{ $submission->created_at->format('h:i A') }}</div>
                                            </td>

                                            {{-- Download Link --}}
                                            <td class="px-6 py-4">
                                                <a href="{{ Storage::url($submission->file_path) }}" target="_blank" class="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                    Download File
                                                </a>
                                            </td>

                                            {{-- Grading Area (FIXED) --}}
                                            <td class="px-6 py-4 text-center">
                                                <form action="{{ route('teacher.grade.store', $submission->id) }}" method="POST" class="flex items-center justify-center gap-2">
                                                    @csrf
                                                    
                                                    {{-- Input Field --}}
                                                    <div class="relative">
                                                        <input type="number" 
                                                               name="grade" 
                                                               value="{{ $submission->grade }}" 
                                                               class="w-20 border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                                                               min="0" 
                                                               max="100" 
                                                               placeholder="--" 
                                                               required>
                                                        <span class="absolute right-6 top-2 text-gray-400 text-xs opacity-0">/100</span>
                                                    </div>

                                                    {{-- Save Button --}}
                                                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition shadow-sm" title="Save Grade">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </button>
                                                </form>

                                                {{-- Status Indicator --}}
                                                @if($submission->grade)
                                                    <div class="mt-2 text-xs text-green-600 font-bold">
                                                        ✅ Graded
                                                    </div>
                                                @else
                                                    <div class="mt-2 text-xs text-yellow-600 font-medium">
                                                        Pending Review
                                                    </div>
                                                @endif
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
    </div>
</x-app-layout>