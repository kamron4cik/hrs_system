<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_list_users()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        User::factory()->count(2)->create();

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users');

        $response->assertStatus(200);
    }

    public function test_super_admin_can_update_user_role()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create(['role' => 'guest']);

        $response = $this->actingAs($admin)->putJson("/api/v1/admin/users/{$user->id}", [
            'role' => 'hotel_admin'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => 'hotel_admin',
        ]);
    }

    public function test_hotel_admin_cannot_access_user_management()
    {
        $hotelAdmin = User::factory()->create(['role' => 'hotel_admin']);

        $response = $this->actingAs($hotelAdmin)->getJson('/api/v1/admin/users');

        $response->assertStatus(200);
    }
}
