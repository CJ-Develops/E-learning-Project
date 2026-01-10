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

        
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'thumbnail_url')) {
                $table->string('thumbnail_url')->nullable()->after('title');
            }

            if (!Schema::hasColumn('courses', 'teacher_id')) {
                $table->foreignId('teacher_id')
                    ->nullable()
                    ->after('description')
                    ->constrained('users')
                    ->onDelete('cascade');
            }
        });

        
        if (Schema::hasColumn('courses', 'user_id')) {
            DB::statement('UPDATE courses SET teacher_id = user_id WHERE teacher_id IS NULL');
        }
        if (Schema::hasColumn('courses', 'thumbnail')) {
            DB::statement('UPDATE courses SET thumbnail_url = thumbnail WHERE thumbnail_url IS NULL');
        }

        // If a legacy instructor_id exists, move it into teacher_id then drop it
        if (Schema::hasColumn('courses', 'instructor_id')) {
            DB::statement('UPDATE courses SET teacher_id = instructor_id WHERE teacher_id IS NULL');
        }

        
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }
            if (Schema::hasColumn('courses', 'thumbnail')) {
                $table->dropColumn('thumbnail');
            }
            if (Schema::hasColumn('courses', 'enrolled')) {
                $table->dropColumn('enrolled');
            }
            if (Schema::hasColumn('courses', 'instructor_id')) {
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
            if (!Schema::hasColumn('courses', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('courses', 'thumbnail')) {
                $table->string('thumbnail')->nullable();
            }
        });

        if (Schema::hasColumn('courses', 'teacher_id')) {
            DB::statement('UPDATE courses SET user_id = teacher_id WHERE user_id IS NULL');
        }
        if (Schema::hasColumn('courses', 'thumbnail_url')) {
            DB::statement('UPDATE courses SET thumbnail = thumbnail_url WHERE thumbnail IS NULL');
        }
        if (!Schema::hasColumn('courses', 'instructor_id')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->unsignedBigInteger('instructor_id')->nullable();
            });
        }
        if (Schema::hasColumn('courses', 'teacher_id')) {
            DB::statement('UPDATE courses SET instructor_id = teacher_id WHERE instructor_id IS NULL');
        }

        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'teacher_id')) {
                $table->dropConstrainedForeignId('teacher_id');
            }
            if (Schema::hasColumn('courses', 'thumbnail_url')) {
                $table->dropColumn('thumbnail_url');
            }
        });
    }
};
