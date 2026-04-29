<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'rating'         => $this->rating,
            'cleanliness'    => $this->cleanliness,
            'service'        => $this->service,
            'location'       => $this->location,
            'comment'        => $this->comment,
            'created_at'     => $this->created_at?->toDateString(),
            'user'           => new UserResource($this->whenLoaded('user')),
            'hotel_id'       => $this->hotel_id,
            'reservation_id' => $this->reservation_id,
        ];
    }
}
