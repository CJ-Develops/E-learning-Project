<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_teacher', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['course_id', 'teacher_id']);
        });

        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'teacher_id')) {
                $rows = DB::table('courses')
                    ->whereNotNull('teacher_id')
                    ->get(['id', 'teacher_id']);
                foreach ($rows as $row) {
                    DB::table('course_teacher')->updateOrInsert(
                        ['course_id' => $row->id, 'teacher_id' => $row->teacher_id],
                        ['created_at' => now(), 'updated_at' => now()]
                    );
                }
                $table->dropConstrainedForeignId('teacher_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'teacher_id')) {
                $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            }
        });

        Schema::dropIfExists('course_teacher');
    }
};
