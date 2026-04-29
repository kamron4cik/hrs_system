<?php

use Illuminate\Database\Migrations\Migration;

// Fields are now included in the base users table migration (0001_01_01_000000).
// This migration is intentionally left as a no-op for compatibility.
return new class extends Migration
{
    public function up(): void {}
    public function down(): void {}
};
