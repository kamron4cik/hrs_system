<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->tinyInteger('rating')->comment('1-5 overall');
            $table->tinyInteger('cleanliness')->nullable()->comment('1-5');
            $table->tinyInteger('service')->nullable()->comment('1-5');
            $table->tinyInteger('location')->nullable()->comment('1-5');
            $table->text('comment')->nullable();
            $table->timestamps();

            // One review per reservation
            $table->unique('reservation_id');
            $table->index(['hotel_id', 'rating']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
