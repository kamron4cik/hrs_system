<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * GET /api/v1/reservations  [Authenticated Guest]
     */
    public function index(Request $request): JsonResponse
    {
        $reservations = Reservation::with(['room.hotel'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 200,
            'data'   => ReservationResource::collection($reservations),
            'meta'   => [
                'total'        => $reservations->total(),
                'current_page' => $reservations->currentPage(),
                'last_page'    => $reservations->lastPage(),
            ],
        ]);
    }

    /**
     * POST /api/v1/reservations  [Authenticated Guest]
     */
    public function store(ReservationRequest $request): JsonResponse
    {
        $room     = Room::findOrFail($request->room_id);
        $checkIn  = $request->check_in_date;
        $checkOut = $request->check_out_date;

        // Double-booking race condition guard
        if (!$room->isAvailableFor($checkIn, $checkOut)) {
            return response()->json([
                'status'  => 409,
                'message' => 'Room is not available for the selected dates',
            ], 409);
        }

        // Calculate nights & total
        $nights     = (int) now()->parse($checkIn)->diffInDays(now()->parse($checkOut));
        $totalPrice = $nights * $room->price_per_night;

        $reservation = Reservation::create([
            'user_id'          => $request->user()->id,
            'room_id'          => $room->id,
            'check_in_date'    => $checkIn,
            'check_out_date'   => $checkOut,
            'num_guests'       => $request->num_guests,
            'total_price'      => $totalPrice,
            'status'           => $request->payment_method === 'cash' ? 'pending' : 'confirmed',
            'special_requests' => $request->special_requests,
        ]);

        // Smart Payment Detection & Processing block
        $paymentStatus = 'paid';
        if ($request->payment_method === 'cash') {
            $paymentStatus = 'pending';
        }

        Payment::create([
            'booking_id'     => $reservation->id,
            'amount'         => $totalPrice,
            'payment_method' => $request->payment_method ?? 'card',
            'card_type'      => $request->card_type,
            'status'         => $paymentStatus,
            'transaction_id' => $request->payment_method !== 'cash' ? 'txn_' . uniqid() : null,
        ]);

        $reservation->load('room.hotel');

        return response()->json([
            'status'  => 201,
            'message' => 'Reservation created successfully',
            'data'    => new ReservationResource($reservation),
        ], 201);
    }

    /**
     * GET /api/v1/reservations/{id}  [Authenticated Guest]
     */
    public function show(Request $request, Reservation $reservation): JsonResponse
    {
        if ($reservation->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $reservation->load(['room.hotel', 'review']);

        return response()->json([
            'status' => 200,
            'data'   => new ReservationResource($reservation),
        ]);
    }

    /**
     * PUT /api/v1/reservations/{id}/cancel  [Authenticated Guest]
     */
    public function cancel(Request $request, Reservation $reservation): JsonResponse
    {
        if ($reservation->user_id != $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        if (!in_array($reservation->status, ['pending', 'confirmed'])) {
            return response()->json([
                'status'  => 422,
                'message' => 'Reservation cannot be cancelled in its current status',
            ], 422);
        }

        $reservation->cancel();

        return response()->json([
            'status'  => 200,
            'message' => 'Reservation cancelled successfully',
            'data'    => new ReservationResource($reservation->fresh()),
        ]);
    }

    // ── Admin endpoints ──────────────────────────────────────

    /**
     * GET /api/v1/admin/reservations  [Admin]
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Reservation::with(['room.hotel', 'user']);

        // Scope to user's properties unless they are super admin
        if (!$request->user()->isSuperAdmin()) {
            $userId = $request->user()->id;
            $query->whereHas('room.hotel', function($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('hotel_id')) {
            $query->whereHas('room', fn($q) => $q->where('hotel_id', $request->hotel_id));
        }
        if ($request->filled('date_from')) {
            $query->where('check_in_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('check_out_date', '<=', $request->date_to);
        }

        $reservations = $query->latest()->paginate(20);

        return response()->json([
            'status' => 200,
            'data'   => ReservationResource::collection($reservations),
            'meta'   => [
                'total'        => $reservations->total(),
                'current_page' => $reservations->currentPage(),
                'last_page'    => $reservations->lastPage(),
            ],
        ]);
    }

    /**
     * PUT /api/v1/admin/reservations/{id}  [Admin]
     */
    public function adminUpdate(Request $request, Reservation $reservation): JsonResponse
    {
        if (!$request->user()->isSuperAdmin() && $reservation->room->hotel->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $reservation->update(['status' => $request->status]);

        if ($request->status === 'cancelled') {
            $reservation->update(['cancelled_at' => now()]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Reservation status updated',
            'data'    => new ReservationResource($reservation->fresh()),
        ]);
    }
}
