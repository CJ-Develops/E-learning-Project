<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->foreignId('created_by')
                ->nullable()
                ->after('course_id')
                ->constrained('users')
                ->nullOnDelete();
        });

        $singleTeacherCourses = DB::table('course_teacher')
            ->select('course_id', DB::raw('MIN(teacher_id) as teacher_id'))
            ->groupBy('course_id')
            ->havingRaw('COUNT(*) = 1')
            ->get();

        foreach ($singleTeacherCourses as $row) {
            DB::table('assignments')
                ->where('course_id', $row->course_id)
                ->whereNull('created_by')
                ->update(['created_by' => $row->teacher_id]);
        }
    }

    public function down(): void
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });
    }
};
