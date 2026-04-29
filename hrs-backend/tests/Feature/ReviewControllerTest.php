<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\Reservation;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_review()
    {
        $user = User::factory()->create();
        $hotel = Hotel::factory()->create();
        $reservation = Reservation::factory()->create([
            'user_id' => $user->id,
            'room_id' => \App\Models\Room::factory()->create(['hotel_id' => $hotel->id])->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($user)->postJson("/api/v1/hotels/{$hotel->id}/reviews", [
            'reservation_id' => $reservation->id,
            'rating' => 5,
            'cleanliness' => 5,
            'service' => 4,
            'location' => 5,
            'comment' => 'Great stay!',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'hotel_id' => $hotel->id,
            'rating' => 5,
        ]);
    }
}
