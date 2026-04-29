<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin();
    }

    public function rules(): array
    {
        return [
            'room_number'     => 'required|string|max:20',
            'room_type'       => 'required|in:single,double,twin,suite,deluxe',
            'capacity'        => 'required|integer|min:1|max:20',
            'price_per_night' => 'required|numeric|min:1',
            'floor'           => 'nullable|integer',
            'bed_type'        => 'nullable|string|max:50',
            'size_sqm'        => 'nullable|integer|min:1',
            'amenities'       => 'nullable|array',
            'amenities.*'     => 'string',
            'photos'          => 'nullable|array',
            'photos.*'        => 'url',
            'is_available'    => 'boolean',
        ];
    }
}
