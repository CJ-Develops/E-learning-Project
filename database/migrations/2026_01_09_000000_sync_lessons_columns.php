<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lessons')) {
            return;
        }

        Schema::table('lessons', function (Blueprint $table) {
            if (!Schema::hasColumn('lessons', 'type')) {
                $table->enum('type', ['pdf', 'youtube'])->default('pdf')->after('title');
            }
            if (!Schema::hasColumn('lessons', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            if (!Schema::hasColumn('lessons', 'file_url')) {
                $table->string('file_url')->nullable()->after('type');
            }
        });

        if (Schema::hasColumn('lessons', 'type')) {
            try {
                DB::statement("ALTER TABLE lessons MODIFY COLUMN type ENUM('pdf','youtube') NOT NULL");
            } catch (\Throwable $e) {
            }
        }

        if (Schema::hasColumn('lessons', 'file_url')) {
            Schema::table('lessons', function (Blueprint $table) {
                $table->string('file_url')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('lessons')) {
            return;
        }

        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasColumn('lessons', 'file_url')) {
                $table->dropColumn('file_url');
            }
            if (Schema::hasColumn('lessons', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('lessons', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};
