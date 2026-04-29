<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'reservation_id' => 'required|exists:reservations,id',
            'rating'         => 'required|integer|between:1,5',
            'cleanliness'    => 'nullable|integer|between:1,5',
            'service'        => 'nullable|integer|between:1,5',
            'location'       => 'nullable|integer|between:1,5',
            'comment'        => 'nullable|string|max:2000',
        ];
    }
}
