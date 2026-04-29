<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_dashboard_stats()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'revenue', 'hotels', 'users', 'reservations', 'recent_reservations'
                     ]
                 ]);
    }

    public function test_guest_cannot_view_dashboard_stats()
    {
        $user = User::factory()->create(['role' => 'guest']);

        $response = $this->actingAs($user)->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }
}
