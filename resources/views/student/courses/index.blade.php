<x-app-layout>
    <div class="py-12 min-h-screen font-sans" style="background-color: #f3f4f6;">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            {{-- 1. Welcome Header --}}
            <div class="mb-8 flex justify-between items-end">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back, {{ Auth::user()->name }}! 👋
                    </h1>
                    <p class="text-gray-500 mt-1">Here is what's happening with your courses.</p>
                </div>
            </div>

            {{-- 2. DASHBOARD WIDGETS (New Feature) --}}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                
                {{-- Left: Pending Assignments --}}
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <span class="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        Due Soon
                    </h3>
                    
                    @if($pendingAssignments->isEmpty())
                        <div class="text-gray-400 text-sm italic">🎉 No pending assignments!</div>
                    @else
                        <div class="space-y-3">
                            @foreach($pendingAssignments as $assign)
                                <a href="{{ route('courses.show', $assign->course_id) }}" class="block p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition border border-gray-100 group">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <div class="font-bold text-gray-800 text-sm group-hover:text-indigo-600">{{ $assign->title }}</div>
                                            <div class="text-xs text-gray-500">{{ $assign->course_title }}</div>
                                        </div>
                                        <div class="text-xs font-bold {{ $assign->due_date && \Carbon\Carbon::parse($assign->due_date)->isPast() ? 'text-red-500' : 'text-gray-400' }}">
                                            {{ $assign->due_date ? \Carbon\Carbon::parse($assign->due_date)->format('M d') : 'No Date' }}
                                        </div>
                                    </div>
                                </a>
                            @endforeach
                        </div>
                    @endif
                </div>

                {{-- Right: Recent Grades --}}
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <span class="bg-green-100 text-green-600 p-1.5 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        Recent Grades
                    </h3>

                    @if($recentGrades->isEmpty())
                        <div class="text-gray-400 text-sm italic">No graded work yet.</div>
                    @else
                        <div class="space-y-3">
                            @foreach($recentGrades as $sub)
                                <div class="p-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <div class="font-bold text-gray-800 text-sm">{{ $sub->assignment_title }}</div>
                                        <div class="text-xs text-gray-500">{{ $sub->course_title }}</div>
                                    </div>
                                    <div class="text-center bg-white px-3 py-1 rounded shadow-sm border border-gray-100">
                                        <div class="text-green-600 font-extrabold">{{ $sub->grade }}</div>
                                        <div class="text-[10px] text-gray-400 uppercase">Score</div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>

            </div>

            {{-- 3. Course Grid (Original Layout) --}}
            <h3 class="font-bold text-xl text-gray-900 mb-6">Your Courses</h3>
            @if($courses->isEmpty())
                <div class="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <h3 class="text-xl font-bold text-gray-900">No courses available yet</h3>
                </div>
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($courses as $course)
                        @php
                            $total = $course->assignments->count();
                            $done = $course->assignments->filter(fn($a) => $a->submissions->isNotEmpty())->count();
                            $percent = $total > 0 ? round(($done / $total) * 100) : 0;
                        @endphp

                        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            {{-- Header --}}
                            <div class="h-32 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center relative">
                                <span class="text-white text-4xl font-extrabold opacity-50">{{ substr($course->title, 0, 1) }}</span>
                            </div>

                            {{-- Body --}}
                            <div class="p-6 flex-1 flex flex-col">
                                <h3 class="text-lg font-bold text-gray-900 mb-1">{{ $course->title }}</h3>
                                <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ $course->description }}</p>
                                
                                {{-- Progress --}}
                                <div class="mt-auto">
                                    <div class="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                        <span>Progress</span>
                                        <span>{{ $percent }}%</span>
                                    </div>
                                    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
                                        <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $percent }}%"></div>
                                    </div>
                                    <a href="{{ route('courses.show', $course->id) }}" class="block w-full text-center bg-gray-900 text-white font-bold py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                                        Enter Course
                                    </a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif

        </div>
    </div>
</x-app-layout>