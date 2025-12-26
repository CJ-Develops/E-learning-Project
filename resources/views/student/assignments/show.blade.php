<x-app-layout>
    <div class="py-12 bg-gray-100 min-h-screen font-sans">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            
            {{-- Back Link --}}
            <div class="mb-6">
                <a href="{{ route('courses.show', $assignment->course->id) }}" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 font-medium">
                    <span>&larr;</span> Back to {{ $assignment->course->title }}
                </a>
            </div>

            <div class="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                
                {{-- Header Section --}}
                <div class="p-8 border-b border-gray-100 bg-white">
                    <div class="flex justify-between items-start">
                        <div>
                            <h1 class="text-3xl font-extrabold text-gray-900">{{ $assignment->title }}</h1>
                            <p class="text-gray-500 mt-2 text-sm uppercase tracking-wide">
                                Course: <span class="text-indigo-600 font-bold">{{ $assignment->course->title }}</span>
                            </p>
                        </div>
                        <div class="text-right">
                             <div class="inline-block px-3 py-1 rounded-full text-sm font-bold border {{ $assignment->due_date && \Carbon\Carbon::parse($assignment->due_date)->isPast() ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100' }}">
                                Due: {{ $assignment->due_date ? \Carbon\Carbon::parse($assignment->due_date)->format('M d, Y') : 'No Deadline' }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8">
                    
                    {{-- Instructions --}}
                    <div class="mb-10">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Instructions</h3>
                        <div class="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            {{ $assignment->description }}
                        </div>
                    </div>

                    {{-- Submission Area --}}
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Your Submission</h3>
                        
                        @if($existingSubmission)
                            {{-- State: Submitted --}}
                            <div class="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="bg-green-100 p-3 rounded-full text-green-600">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-bold text-green-900">Assignment Submitted</h4>
                                        <p class="text-green-700 text-sm">On {{ $existingSubmission->created_at->format('M d, Y h:i A') }}</p>
                                    </div>
                                </div>
                                
                                @if($existingSubmission->grade)
                                    <div class="text-center bg-white p-3 rounded shadow-sm">
                                        <div class="text-2xl font-bold text-gray-900">{{ $existingSubmission->grade }}<span class="text-xs text-gray-400">/100</span></div>
                                        <div class="text-xs text-gray-500 uppercase font-bold">Grade</div>
                                    </div>
                                @else
                                    <span class="bg-white border border-yellow-200 text-yellow-700 text-xs px-3 py-1 rounded-full font-bold">
                                        Pending Grade
                                    </span>
                                @endif
                            </div>

                        @else
                            {{-- State: Form --}}
                            <form action="{{ route('assignments.submit', $assignment->id) }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                
                                {{-- 1. Upload Box --}}
                                <div class="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 mb-6">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload your work (PDF, DOC, ZIP)</label>
                                    <input type="file" name="file" class="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100
                                        cursor-pointer border border-gray-300 rounded p-2" required>
                                </div>

                                {{-- 2. Submit Button (Moved OUTSIDE the dashed box so it's clearly visible) --}}
                                <button type="submit" class="w-full bg-blue-600 text-white font-extrabold text-lg py-4 px-6 rounded-lg hover:bg-blue-700 shadow-xl transition duration-200 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    Submit Assignment
                                </button>
                            </form>
                        @endif

                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>