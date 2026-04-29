<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\Hotel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_check_room_availability()
    {
        $hotel = Hotel::factory()->create(['is_active' => true]);
        $room = Room::factory()->create([
            'hotel_id' => $hotel->id,
            'is_available' => true,
        ]);

        $checkIn = now()->addDays(5)->format('Y-m-d');
        $checkOut = now()->addDays(10)->format('Y-m-d');
        $response = $this->getJson("/api/v1/rooms/{$room->id}/availability?check_in={$checkIn}&check_out={$checkOut}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.available', true);
    }
}
