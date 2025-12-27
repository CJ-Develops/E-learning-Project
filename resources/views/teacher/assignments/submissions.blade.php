<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Grading: {{ $assignment->title }}
                </h2>
                <p class="text-sm text-gray-500 mt-1">Total Points: <span class="font-bold">100</span></p>
            </div>
            <a href="{{ route('teacher.assignments.index', $assignment->course_id) }}" class="text-sm text-blue-600 hover:underline font-bold flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Assignments
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                
                @if($submissions->isEmpty())
                    <div class="p-12 text-center">
                        <div class="inline-block p-4 rounded-full bg-gray-50 mb-4">
                            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900">No Submissions Yet</h3>
                        <p class="text-gray-500 mt-1">Students have not submitted any work for this assignment.</p>
                    </div>
                @else
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500 divide-y divide-gray-100">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 font-bold">Student Name</th>
                                    <th class="px-6 py-3 font-bold">Submission Date</th>
                                    <th class="px-6 py-3 font-bold">File</th>
                                    <th class="px-6 py-3 font-bold">Grading (0-100)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                @foreach($submissions as $submission)
                                    <tr class="hover:bg-gray-50 transition">
                                        
                                        {{-- Student Name --}}
                                        <td class="px-6 py-4">
                                            <div class="flex items-center">
                                                <div class="h-10 w-10 flex-shrink-0">
                                                    <span class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                        {{ substr($submission->user->name, 0, 1) }}
                                                    </span>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="font-bold text-gray-900">{{ $submission->user->name }}</div>
                                                    <div class="text-xs text-gray-500">{{ $submission->user->email }}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {{-- Date --}}
                                        <td class="px-6 py-4">
                                            <div class="text-gray-900 font-medium">{{ $submission->created_at->format('M d, Y') }}</div>
                                            <div class="text-xs text-gray-500">{{ $submission->created_at->format('h:i A') }}</div>
                                        </td>

                                        {{-- File Download --}}
                                        <td class="px-6 py-4">
                                            @if($submission->file_path)
                                                <a href="{{ Storage::url($submission->file_path) }}" target="_blank" class="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                    Download File
                                                </a>
                                            @else
                                                <span class="text-gray-400 italic flex items-center gap-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                    No file attached
                                                </span>
                                            @endif
                                        </td>

                                        {{-- GRADING FORM --}}
                                        <td class="px-6 py-4">
                                            <div class="flex flex-col items-start gap-2">
                                                <form action="{{ route('teacher.grade.store', $submission->id) }}" method="POST" class="flex items-center gap-2">
                                                    @csrf
                                                    
                                                    {{-- Input (With 0-100 Limit Logic) --}}
                                                    <div class="relative">
                                                        <input type="number" 
                                                               name="grade" 
                                                               value="{{ $submission->grade }}" 
                                                               min="0" 
                                                               max="100" 
                                                               oninput="if(this.value > 100) this.value = 100; if(this.value < 0) this.value = 0;"
                                                               class="w-24 pl-4 pr-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 font-bold text-gray-800" 
                                                               placeholder="0">
                                                    </div>

                                                    {{-- Confirm / Save Button --}}
                                                    <button type="submit" class="bg-blue-600 text-white p-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center tooltip" title="Save Grade">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </button>
                                                </form>

                                                {{-- Graded Status --}}
                                                @if($submission->grade !== null)
                                                    <div class="text-green-600 text-xs font-bold uppercase flex items-center gap-1 pl-1">
                                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                                        Graded
                                                    </div>
                                                @endif
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