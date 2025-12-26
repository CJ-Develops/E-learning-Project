<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Create New Course') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    
                    <form action="{{ route('teacher.courses.store') }}" method="POST">
                        @csrf
                        
                        {{-- Title --}}
                        <div class="mb-6">
                            <label class="block font-medium text-sm text-gray-700 mb-2">Course Title</label>
                            <input type="text" name="title" class="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm" placeholder="e.g. Advanced PHP Techniques" required>
                        </div>

                        {{-- Description --}}
                        <div class="mb-6">
                            <label class="block font-medium text-sm text-gray-700 mb-2">Description</label>
                            <textarea name="description" rows="5" class="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm" placeholder="What will students learn in this course?" required></textarea>
                        </div>

                        {{-- Price Input REMOVED --}}
                        
                        <div class="flex justify-end">
                            <a href="{{ route('teacher.courses') }}" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300 transition">
                                Cancel
                            </a>
                            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-lg transition">
                                Create Course
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>