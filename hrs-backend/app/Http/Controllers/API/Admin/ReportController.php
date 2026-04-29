<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * GET /api/v1/admin/reports
     * Returns daily revenue for the last 30 days (for line chart)
     * Also returns monthly breakdown for bar chart
     */
    public function index(Request $request): JsonResponse
    {
        $days = (int) $request->input('days', 30);
        $days = min($days, 365); // cap at 1 year

        // ── Daily revenue (last N days) ───────────────────────────────
        $start = Carbon::now()->subDays($days - 1)->startOfDay();

        $daily = Reservation::whereIn('status', ['confirmed', 'completed'])
            ->where('created_at', '>=', $start)
            ->selectRaw("DATE(created_at) as date, SUM(total_price) as revenue, COUNT(*) as bookings")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Fill in days with 0 revenue
        $dailyChart = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dailyChart[] = [
                'date'     => $date,
                'revenue'  => isset($daily[$date]) ? round($daily[$date]->revenue, 2) : 0,
                'bookings' => isset($daily[$date]) ? (int) $daily[$date]->bookings : 0,
            ];
        }

        // ── Monthly revenue (last 6 months) ──────────────────────────
        $monthlyChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Reservation::whereIn('status', ['confirmed', 'completed'])
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_price');

            $monthlyChart[] = [
                'month'   => $month->format('M Y'),
                'revenue' => round($revenue, 2),
            ];
        }

        // ── Top hotels by revenue ─────────────────────────────────────
        $topHotels = Reservation::whereIn('status', ['confirmed', 'completed'])
            ->with('room.hotel')
            ->selectRaw('room_id, SUM(total_price) as revenue, COUNT(*) as bookings')
            ->groupBy('room_id')
            ->orderByDesc('revenue')
            ->limit(20)
            ->get()
            ->groupBy(fn($r) => $r->room?->hotel?->id)
            ->map(fn($group) => [
                'hotel'    => $group->first()?->room?->hotel?->name ?? 'Unknown',
                'revenue'  => round($group->sum('revenue'), 2),
                'bookings' => $group->sum('bookings'),
            ])
            ->values()
            ->take(5);

        return response()->json([
            'status' => 200,
            'data'   => [
                'daily'      => $dailyChart,
                'monthly'    => $monthlyChart,
                'top_hotels' => $topHotels,
            ],
        ]);
    }
}
