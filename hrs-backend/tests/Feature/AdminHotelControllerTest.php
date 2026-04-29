<?php

namespace Tests\Feature\Admin;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminHotelControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_all_hotels()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        Hotel::factory()->count(2)->create();

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/hotels');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_super_admin_can_toggle_hotel_status()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $hotel = Hotel::factory()->create(['is_active' => true]);

        $response = $this->actingAs($admin)->patchJson("/api/v1/admin/hotels/{$hotel->id}/toggle");

        $response->assertStatus(200);
        $this->assertDatabaseHas('hotels', [
            'id' => $hotel->id,
            'is_active' => false,
        ]);
    }
}
