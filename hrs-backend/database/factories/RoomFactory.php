<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'hotel_id' => Hotel::factory(),
            'room_number' => (string) fake()->numberBetween(100, 999),
            'room_type' => fake()->randomElement(['single', 'double', 'twin', 'suite', 'deluxe']),
            'capacity' => fake()->numberBetween(1, 4),
            'price_per_night' => fake()->randomFloat(2, 50, 500),
            'floor' => fake()->numberBetween(1, 10),
            'bed_type' => fake()->randomElement(['single', 'double', 'queen', 'king']),
            'size_sqm' => fake()->numberBetween(20, 100),
            'amenities' => ['TV', 'AC', 'Mini-bar'],
            'photos' => [fake()->imageUrl()],
            'is_available' => true,
        ];
    }
}
