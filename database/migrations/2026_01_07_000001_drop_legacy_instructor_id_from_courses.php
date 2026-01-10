<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        
        if (Schema::hasColumn('courses', 'instructor_id')) {
            DB::statement('UPDATE courses SET teacher_id = instructor_id WHERE teacher_id IS NULL');
        }

        
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'teacher_id')) {
                $table->unsignedBigInteger('teacher_id')->nullable()->change();
            }
        });

        
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'instructor_id')) {
               
                try {
                    $table->dropForeign(['instructor_id']);
                } catch (\Throwable $e) {
                    
                }
                $table->dropColumn('instructor_id');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'instructor_id')) {
                $table->unsignedBigInteger('instructor_id')->nullable();
            }
        });

        if (Schema::hasColumn('courses', 'teacher_id')) {
            DB::statement('UPDATE courses SET instructor_id = teacher_id WHERE instructor_id IS NULL');
        }
    }
};
