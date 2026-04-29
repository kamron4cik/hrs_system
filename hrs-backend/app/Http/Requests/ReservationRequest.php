<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'room_id'          => 'required|exists:rooms,id',
            'check_in_date'    => 'required|date|after_or_equal:today',
            'check_out_date'   => 'required|date|after:check_in_date',
            'num_guests'       => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:1000',
            'payment_method'   => 'required|in:card,paypal,cash',
            'card_type'        => 'nullable|in:uzcard,humo,visa,mastercard',
        ];
    }

    public function messages(): array
    {
        return [
            'check_out_date.after' => 'Check-out date must be after check-in date',
            'check_in_date.after_or_equal' => 'Check-in date cannot be in the past',
        ];
    }
}
