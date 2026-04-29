<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('room_number', 20);
            $table->enum('room_type', ['single', 'double', 'twin', 'suite', 'deluxe']);
            $table->tinyInteger('capacity')->comment('Max guests');
            $table->decimal('price_per_night', 10, 2);
            $table->tinyInteger('floor')->nullable();
            $table->string('bed_type', 50)->nullable()->comment('king|queen|twin|single');
            $table->integer('size_sqm')->nullable();
            $table->json('amenities')->nullable();
            $table->json('photos')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['hotel_id', 'room_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
