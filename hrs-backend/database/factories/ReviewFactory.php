<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use App\Models\Hotel;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'hotel_id' => Hotel::factory(),
            'reservation_id' => Reservation::factory(),
            'rating' => fake()->numberBetween(1, 5),
            'cleanliness' => fake()->numberBetween(1, 5),
            'service' => fake()->numberBetween(1, 5),
            'location' => fake()->numberBetween(1, 5),
            'comment' => fake()->paragraph(),
        ];
    }
}
