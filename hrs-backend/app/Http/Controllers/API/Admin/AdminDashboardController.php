<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // ── Revenue ──────────────────────────────────────────────────
        $base = Reservation::whereIn('status', ['confirmed', 'completed']);

        $totalRevenue   = (clone $base)->sum('total_price');
        $dailyRevenue   = (clone $base)->whereDate('created_at', Carbon::today())->sum('total_price');
        $weeklyRevenue  = (clone $base)->whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek(),
        ])->sum('total_price');
        $monthlyRevenue = (clone $base)->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_price');

        // ── Hotels ───────────────────────────────────────────────────
        $activeHotels   = Hotel::where('is_active', true)->count();
        $inactiveHotels = Hotel::where('is_active', false)->count();

        // ── Users ─────────────────────────────────────────────────────
        $activeUsers   = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();

        // ── Reservation status counts ─────────────────────────────────
        $statuses = Reservation::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // ── Recent reservations ───────────────────────────────────────
        $recent = Reservation::with(['user', 'room.hotel'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn($r) => [
                'id'                => $r->id,
                'confirmation_code' => $r->confirmation_code,
                'guest'             => $r->user?->first_name . ' ' . $r->user?->last_name,
                'email'             => $r->user?->email,
                'hotel'             => $r->room?->hotel?->name,
                'room_type'         => $r->room?->room_type,
                'check_in'          => $r->check_in_date,
                'check_out'         => $r->check_out_date,
                'total_price'       => $r->total_price,
                'status'            => $r->status,
                'created_at'        => $r->created_at,
            ]);

        return response()->json([
            'status' => 200,
            'data'   => [
                'revenue' => [
                    'total'   => round($totalRevenue, 2),
                    'daily'   => round($dailyRevenue, 2),
                    'weekly'  => round($weeklyRevenue, 2),
                    'monthly' => round($monthlyRevenue, 2),
                ],
                'hotels' => [
                    'active'   => $activeHotels,
                    'inactive' => $inactiveHotels,
                    'total'    => $activeHotels + $inactiveHotels,
                ],
                'users' => [
                    'active'   => $activeUsers,
                    'inactive' => $inactiveUsers,
                    'total'    => $activeUsers + $inactiveUsers,
                ],
                'reservations' => [
                    'pending'   => $statuses['pending']   ?? 0,
                    'confirmed' => $statuses['confirmed'] ?? 0,
                    'completed' => $statuses['completed'] ?? 0,
                    'cancelled' => $statuses['cancelled'] ?? 0,
                    'total'     => Reservation::count(),
                ],
                'recent_reservations' => $recent,
            ],
        ]);
    }
}
