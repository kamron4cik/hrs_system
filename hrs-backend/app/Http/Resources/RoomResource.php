<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'hotel_id'        => $this->hotel_id,
            'room_number'     => $this->room_number,
            'room_type'       => $this->room_type,
            'capacity'        => $this->capacity,
            'price_per_night' => $this->price_per_night,
            'floor'           => $this->floor,
            'bed_type'        => $this->bed_type,
            'size_sqm'        => $this->size_sqm,
            'amenities'       => $this->amenities ?? [],
            'photos'          => $this->photos ?? [],
            'is_available'    => $this->is_available,
            'hotel'           => new HotelResource($this->whenLoaded('hotel')),
        ];
    }
}
