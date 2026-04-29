<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'description'     => $this->description,
            'city'            => $this->city,
            'country'         => $this->country,
            'address'         => $this->address,
            'star_rating'     => $this->star_rating,
            'check_in_time'   => $this->check_in_time,
            'check_out_time'  => $this->check_out_time,
            'amenities'       => $this->amenities ?? [],
            'thumbnail'       => $this->thumbnail,
            'latitude'        => $this->latitude,
            'longitude'       => $this->longitude,
            'is_active'       => $this->is_active,
            'average_rating'  => $this->average_rating,
            'price_from'      => $this->price_from,
            'review_count'    => $this->whenLoaded('reviews', fn() => $this->reviews->count()),
            'images'          => HotelImageResource::collection($this->whenLoaded('images')),
            'rooms'           => RoomResource::collection($this->whenLoaded('rooms')),
            'reviews'         => ReviewResource::collection($this->whenLoaded('reviews')),
            'owner'           => new UserResource($this->whenLoaded('owner')),
            'created_at'      => $this->created_at?->toDateString(),
        ];
    }
}
