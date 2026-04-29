<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Hotel;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * POST /api/v1/hotels/{hotel}/reviews  [Authenticated Guest]
     * Must have a completed stay at this hotel.
     */
    public function store(ReviewRequest $request, Hotel $hotel): JsonResponse
    {
        $user = $request->user();

        // Verify the guest has a completed reservation at this hotel
        $reservation = $user->reservations()
            ->whereHas('room', fn($q) => $q->where('hotel_id', $hotel->id))
            ->where('status', 'completed')
            ->whereDoesntHave('review')
            ->where('id', $request->reservation_id)
            ->first();

        if (!$reservation) {
            return response()->json([
                'status'  => 403,
                'message' => 'You can only review hotels where you have completed a stay',
            ], 403);
        }

        $review = Review::create([
            'user_id'        => $user->id,
            'hotel_id'       => $hotel->id,
            'reservation_id' => $reservation->id,
            'rating'         => $request->rating,
            'cleanliness'    => $request->cleanliness,
            'service'        => $request->service,
            'location'       => $request->location,
            'comment'        => $request->comment,
        ]);

        $review->load('user');

        return response()->json([
            'status'  => 201,
            'message' => 'Review submitted successfully',
            'data'    => new ReviewResource($review),
        ], 201);
    }

    /**
     * PUT /api/v1/reviews/{review}  [Own review]
     */
    public function update(ReviewRequest $request, Review $review): JsonResponse
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $review->update($request->only('rating', 'cleanliness', 'service', 'location', 'comment'));

        return response()->json([
            'status'  => 200,
            'message' => 'Review updated',
            'data'    => new ReviewResource($review->fresh()->load('user')),
        ]);
    }

    /**
     * DELETE /api/v1/reviews/{review}  [Own review or Admin]
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $review->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Review deleted',
        ]);
    }
}
