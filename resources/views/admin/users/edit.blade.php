<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Edit User: {{ $user->name }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                
                <form action="{{ route('admin.users.update', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    
                    {{-- Name --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Full Name</label>
                        <input type="text" name="name" value="{{ $user->name }}" class="w-full border-gray-300 rounded-md shadow-sm" required>
                    </div>

                    {{-- Email --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Email Address</label>
                        <input type="email" name="email" value="{{ $user->email }}" class="w-full border-gray-300 rounded-md shadow-sm" required>
                    </div>

                    {{-- Role Selection --}}
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Role</label>
                        <select name="role" class="w-full border-gray-300 rounded-md shadow-sm">
                            <option value="student" {{ $user->role == 'student' ? 'selected' : '' }}>Student</option>
                            <option value="teacher" {{ $user->role == 'teacher' ? 'selected' : '' }}>Teacher</option>
                            <option value="admin" {{ $user->role == 'admin' ? 'selected' : '' }}>Administrator</option>
                        </select>
                    </div>

                    {{-- Password (Optional) --}}
                    <div class="mb-6">
                        <label class="block text-gray-700 font-bold mb-2">New Password (Optional)</label>
                        <input type="password" name="password" class="w-full border-gray-300 rounded-md shadow-sm" placeholder="Leave blank to keep current password">
                    </div>

                    {{-- Buttons --}}
                    <div class="flex justify-end gap-4">
                        <a href="{{ route('admin.users') }}" class="text-gray-500 hover:underline py-2">Cancel</a>
                        <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
                            Update User
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>