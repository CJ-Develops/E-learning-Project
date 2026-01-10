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

        try {
            DB::statement("ALTER TABLE lessons MODIFY COLUMN type ENUM('link','file') NOT NULL DEFAULT 'link'");
        } catch (\Throwable $e) {
            try {
                Schema::table('lessons', function (Blueprint $table) {
                    $table->string('type', 20)->default('link')->change();
                });
            } catch (\Throwable $ignored) {
            }
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('lessons')) {
            return;
        }

        try {
            DB::statement("ALTER TABLE lessons MODIFY COLUMN type ENUM('pdf','youtube') NOT NULL DEFAULT 'pdf'");
        } catch (\Throwable $e) {
            try {
                Schema::table('lessons', function (Blueprint $table) {
                    $table->string('type', 20)->default('pdf')->change();
                });
            } catch (\Throwable $ignored) {
                //
            }
        }
    }
};
