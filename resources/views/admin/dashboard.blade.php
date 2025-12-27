<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Admin Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <h3 class="text-2xl font-bold text-gray-900 mb-6">System Overview</h3>

            {{-- Stats Grid --}}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {{-- Total Users --}}
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-gray-500 text-sm font-bold uppercase">Total Users</div>
                    <div class="text-4xl font-extrabold text-blue-600 mt-2">{{ $totalUsers }}</div>
                </div>

                {{-- Total Courses --}}
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-gray-500 text-sm font-bold uppercase">Active Courses</div>
                    <div class="text-4xl font-extrabold text-indigo-600 mt-2">{{ $totalCourses }}</div>
                </div>

                {{-- Teachers --}}
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-gray-500 text-sm font-bold uppercase">Teachers</div>
                    <div class="text-4xl font-extrabold text-orange-500 mt-2">{{ $totalTeachers }}</div>
                </div>

                {{-- Students --}}
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div class="text-gray-500 text-sm font-bold uppercase">Students</div>
                    <div class="text-4xl font-extrabold text-green-500 mt-2">{{ $totalStudents }}</div>
                </div>
            </div>

            {{-- Quick Links --}}
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 class="font-bold text-lg mb-4">Quick Actions</h4>
                <a href="{{ route('admin.users') }}" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700">
                    Manage Users & Roles &rarr;
                </a>
            </div>

        </div>
    </div>
</x-app-layout>