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

        // Add type column if missing, with allowed values pdf/youtube
        Schema::table('lessons', function (Blueprint $table) {
            if (!Schema::hasColumn('lessons', 'type')) {
                $table->enum('type', ['pdf', 'youtube'])->default('pdf')->after('title');
            }
        });

        // If column existed but with different definition, normalize to enum(pdf,youtube)
        try {
            DB::statement("ALTER TABLE lessons MODIFY COLUMN type ENUM('pdf','youtube') NOT NULL");
        } catch (\Throwable $e) {
            // Ignore if DB platform or existing data prevents alteration; at least column exists now.
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('lessons')) {
            return;
        }

        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasColumn('lessons', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};
