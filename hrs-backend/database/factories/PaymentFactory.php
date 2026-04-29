<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'booking_id' => Reservation::factory(),
            'amount' => fake()->randomFloat(2, 50, 1000),
            'payment_method' => fake()->randomElement(['card', 'paypal', 'cash']),
            'card_type' => fake()->randomElement(['visa', 'mastercard', null]),
            'status' => fake()->randomElement(['pending', 'completed', 'failed']),
            'transaction_id' => strtoupper(Str::random(12)),
        ];
    }
}
