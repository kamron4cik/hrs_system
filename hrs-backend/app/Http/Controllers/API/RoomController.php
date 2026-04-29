<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * POST /api/v1/hotels/{hotel}/rooms  [Admin]
     */
    public function store(RoomRequest $request, Hotel $hotel): JsonResponse
    {
        if (!$request->user()->isSuperAdmin() && $hotel->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $room = $hotel->rooms()->create($request->validated());

        return response()->json([
            'status'  => 201,
            'message' => 'Room added successfully',
            'data'    => new RoomResource($room),
        ], 201);
    }

    /**
     * PUT /api/v1/rooms/{room}  [Admin]
     */
    public function update(RoomRequest $request, Room $room): JsonResponse
    {
        if (!$request->user()->isSuperAdmin() && $room->hotel->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $room->update($request->validated());

        return response()->json([
            'status'  => 200,
            'message' => 'Room updated successfully',
            'data'    => new RoomResource($room->fresh()),
        ]);
    }

    /**
     * DELETE /api/v1/rooms/{room}  [Admin]
     */
    public function destroy(Request $request, Room $room): JsonResponse
    {
        if (!$request->user()->isSuperAdmin() && $room->hotel->user_id !== $request->user()->id) {
            return response()->json(['status' => 403, 'message' => 'Forbidden'], 403);
        }

        $room->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Room deleted successfully',
        ]);
    }

    /**
     * GET /api/v1/rooms/{room}/availability?check_in=&check_out=
     */
    public function availability(Request $request, Room $room): JsonResponse
    {
        $request->validate([
            'check_in'  => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
        ]);

        $available = $room->isAvailableFor($request->check_in, $request->check_out);

        return response()->json([
            'status' => 200,
            'data'   => [
                'room_id'   => $room->id,
                'available' => $available,
                'check_in'  => $request->check_in,
                'check_out' => $request->check_out,
            ],
        ]);
    }
}
