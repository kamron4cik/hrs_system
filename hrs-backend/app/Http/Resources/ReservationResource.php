<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'confirmation_code' => $this->confirmation_code,
            'check_in_date'     => $this->check_in_date?->toDateString(),
            'check_out_date'    => $this->check_out_date?->toDateString(),
            'num_guests'        => $this->num_guests,
            'total_price'       => $this->total_price,
            'nights'            => $this->nights,
            'status'            => $this->status,
            'special_requests'  => $this->special_requests,
            'cancelled_at'      => $this->cancelled_at?->toDateTimeString(),
            'created_at'        => $this->created_at?->toDateTimeString(),
            'room'              => new RoomResource($this->whenLoaded('room')),
            'user'              => new UserResource($this->whenLoaded('user')),
            'review'            => new ReviewResource($this->whenLoaded('review')),
        ];
    }
}
