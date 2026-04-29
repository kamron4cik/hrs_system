<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_their_reservations()
    {
        $user = User::factory()->create();
        Reservation::factory()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/reservations');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_user_can_create_reservation()
    {
        $user = User::factory()->create();
        $room = Room::factory()->create(['is_available' => true, 'price_per_night' => 100]);

        $response = $this->actingAs($user)->postJson('/api/v1/reservations', [
            'room_id' => $room->id,
            'check_in_date' => now()->addDays(1)->format('Y-m-d'),
            'check_out_date' => now()->addDays(3)->format('Y-m-d'),
            'num_guests' => 1,
            'payment_method' => 'cash'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reservations', [
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);
    }

    public function test_user_can_cancel_own_reservation()
    {
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(['user_id' => $user->id, 'status' => 'confirmed']);

        $response = $this->actingAs($user)->putJson("/api/v1/reservations/{$reservation->id}/cancel");

        $response->assertStatus(200);
        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_user_cannot_cancel_others_reservation()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $reservation = Reservation::factory()->create(['user_id' => $otherUser->id, 'status' => 'confirmed']);

        $response = $this->actingAs($user)->putJson("/api/v1/reservations/{$reservation->id}/cancel");

        $response->assertStatus(403);
    }
}
