<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HotelControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_hotels()
    {
        Hotel::factory()->count(3)->create(['is_active' => true]);

        $response = $this->getJson('/api/v1/hotels');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    public function test_can_get_hotel_details()
    {
        $hotel = Hotel::factory()->create(['is_active' => true]);

        $response = $this->getJson("/api/v1/hotels/{$hotel->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $hotel->id);
    }

    public function test_can_get_hotel_rooms()
    {
        $hotel = Hotel::factory()->hasRooms(2)->create(['is_active' => true]);

        $response = $this->getJson("/api/v1/hotels/{$hotel->id}/rooms");

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_can_get_hotel_reviews()
    {
        $hotel = Hotel::factory()->hasReviews(2)->create(['is_active' => true]);

        $response = $this->getJson("/api/v1/hotels/{$hotel->id}/reviews");

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }
}
