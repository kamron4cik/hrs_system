<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Hotel>
 */
class HotelFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->company() . ' Hotel',
            'description' => json_encode(['en' => fake()->paragraph(), 'ru' => fake()->paragraph()]),
            'city' => fake()->city(),
            'country' => fake()->country(),
            'address' => fake()->address(),
            'star_rating' => fake()->numberBetween(1, 5),
            'check_in_time' => '14:00',
            'check_out_time' => '12:00',
            'amenities' => ['WiFi', 'Pool', 'Parking'],
            'thumbnail' => fake()->imageUrl(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'is_active' => true,
        ];
    }
}
