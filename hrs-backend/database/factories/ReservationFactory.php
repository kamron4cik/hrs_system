<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('+1 days', '+1 month');
        $checkOut = (clone $checkIn)->modify('+' . fake()->numberBetween(1, 7) . ' days');
        
        return [
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'num_guests' => fake()->numberBetween(1, 2),
            'total_price' => fake()->randomFloat(2, 100, 1000),
            'status' => fake()->randomElement(['pending', 'confirmed']),
            'special_requests' => fake()->sentence(),
            'confirmation_code' => strtoupper(fake()->lexify('????????')),
        ];
    }
}
