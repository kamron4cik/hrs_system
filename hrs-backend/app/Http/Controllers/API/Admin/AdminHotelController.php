<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminHotelController extends Controller
{
    /**
     * GET /api/v1/admin/hotels
     * Returns ALL hotels (active + inactive) with pagination
     */
    public function index(Request $request): JsonResponse
    {
        $query = Hotel::with(['owner', 'images'])
            ->withCount(['rooms', 'reviews']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('city', 'like', "%$s%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $hotels = $query->orderByDesc('created_at')->paginate(15);

        return response()->json([
            'status' => 200,
            'data'   => $hotels->map(fn($h) => $this->format($h)),
            'meta'   => [
                'current_page' => $hotels->currentPage(),
                'last_page'    => $hotels->lastPage(),
                'total'        => $hotels->total(),
                'per_page'     => $hotels->perPage(),
            ],
        ]);
    }

    /**
     * PATCH /api/v1/admin/hotels/{hotel}/toggle
     * Toggle is_active for a hotel
     */
    public function toggle(Hotel $hotel): JsonResponse
    {
        $hotel->update(['is_active' => !$hotel->is_active]);

        return response()->json([
            'status'  => 200,
            'message' => $hotel->is_active ? 'Hotel activated.' : 'Hotel deactivated.',
            'data'    => $this->format($hotel->fresh()->loadCount(['rooms', 'reviews'])),
        ]);
    }

    private function format(Hotel $h): array
    {
        return [
            'id'           => $h->id,
            'name'         => $h->name,
            'city'         => $h->city,
            'country'      => $h->country,
            'star_rating'  => $h->star_rating,
            'is_active'    => $h->is_active,
            'rooms_count'  => $h->rooms_count ?? 0,
            'reviews_count'=> $h->reviews_count ?? 0,
            'thumbnail'    => $h->thumbnail,
            'owner'        => $h->owner ? [
                'id'    => $h->owner->id,
                'name'  => $h->owner->full_name,
                'email' => $h->owner->email,
            ] : null,
            'created_at'   => $h->created_at,
        ];
    }
}
