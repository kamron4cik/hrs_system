<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\HotelRequest;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * GET /api/v1/hotels
     * Filters: city, check_in, check_out, guests, stars, min_price, max_price, amenities
     */
    public function index(Request $request): JsonResponse
    {
        $query = Hotel::with(['images', 'reviews'])
            ->where('is_active', true);

        // City filter
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Star rating filter
        if ($request->filled('stars')) {
            $stars = is_array($request->stars) ? $request->stars : explode(',', $request->stars);
            $query->whereIn('star_rating', $stars);
        }

        // Guest / room availability filter
        if ($request->filled('check_in') && $request->filled('check_out')) {
            $checkIn  = $request->check_in;
            $checkOut = $request->check_out;
            $guests   = (int) ($request->input('guests', 1));

            // Only hotels that have at least one available room for the period
            $query->whereHas('rooms', function ($q) use ($checkIn, $checkOut, $guests) {
                $q->where('is_available', true)
                  ->where('capacity', '>=', $guests)
                  ->whereDoesntHave('reservations', function ($rq) use ($checkIn, $checkOut) {
                      $rq->whereIn('status', ['pending', 'confirmed'])
                         ->where('check_in_date', '<', $checkOut)
                         ->where('check_out_date', '>', $checkIn);
                  });
            });
        }

        // Sorting
        $sort = $request->input('sort', 'recommended');
        match ($sort) {
            'price_asc'  => $query->orderByRaw('(SELECT MIN(price_per_night) FROM rooms WHERE rooms.hotel_id = hotels.id AND rooms.is_available = 1) ASC'),
            'price_desc' => $query->orderByRaw('(SELECT MIN(price_per_night) FROM rooms WHERE rooms.hotel_id = hotels.id AND rooms.is_available = 1) DESC'),
            'rating'     => $query->orderByRaw('(SELECT AVG(rating) FROM reviews WHERE reviews.hotel_id = hotels.id) DESC'),
            default      => $query->orderByDesc('id'),
        };

        $hotels = $query->paginate((int) $request->input('per_page', 10));

        return response()->json([
            'status' => 200,
            'data'   => HotelResource::collection($hotels),
            'meta'   => [
                'current_page' => $hotels->currentPage(),
                'last_page'    => $hotels->lastPage(),
                'total'        => $hotels->total(),
                'per_page'     => $hotels->perPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/hotels/{id}
     */
    public function show(Hotel $hotel): JsonResponse
    {
        $hotel->load(['rooms', 'reviews.user', 'images', 'owner']);

        return response()->json([
            'status' => 200,
            'data'   => new HotelResource($hotel),
        ]);
    }

    /**
     * POST /api/v1/hotels  [Admin]
     */
    public function store(HotelRequest $request): JsonResponse
    {
        $hotel = Hotel::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'status'  => 201,
            'message' => 'Hotel created successfully',
            'data'    => new HotelResource($hotel),
        ], 201);
    }

    /**
     * PUT /api/v1/hotels/{id}  [Admin]
     */
    public function update(HotelRequest $request, Hotel $hotel): JsonResponse
    {
        if (!$request->user()->isSuperAdmin() && $hotel->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $hotel->update($request->validated());

        return response()->json([
            'status'  => 200,
            'message' => 'Hotel updated successfully',
            'data'    => new HotelResource($hotel->fresh()),
        ]);
    }

    /**
     * DELETE /api/v1/hotels/{id}  [Admin]
     */
    public function destroy(Request $request, Hotel $hotel): JsonResponse
    {
        if (!$request->user()->isSuperAdmin() && $hotel->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $hotel->update(['is_active' => false]);

        return response()->json([
            'status'  => 200,
            'message' => 'Hotel deactivated successfully',
        ]);
    }

    /**
     * GET /api/v1/hotels/{id}/rooms
     */
    public function rooms(Request $request, Hotel $hotel): JsonResponse
    {
        $query = $hotel->rooms()->where('is_available', true);

        if ($request->filled('check_in') && $request->filled('check_out')) {
            $checkIn  = $request->check_in;
            $checkOut = $request->check_out;
            $guests   = (int) ($request->input('guests', 1));

            $query->where('capacity', '>=', $guests)
                  ->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut) {
                      $q->whereIn('status', ['pending', 'confirmed'])
                        ->where('check_in_date', '<', $checkOut)
                        ->where('check_out_date', '>', $checkIn);
                  });
        }

        return response()->json([
            'status' => 200,
            'data'   => \App\Http\Resources\RoomResource::collection($query->get()),
        ]);
    }

    /**
     * GET /api/v1/hotels/{id}/reviews
     */
    public function reviews(Hotel $hotel): JsonResponse
    {
        $reviews = $hotel->reviews()->with('user')->latest()->paginate(10);

        return response()->json([
            'status' => 200,
            'data'   => \App\Http\Resources\ReviewResource::collection($reviews),
            'meta'   => [
                'total'        => $reviews->total(),
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'average'      => round($hotel->reviews()->avg('rating'), 1),
            ],
        ]);
    }
}
