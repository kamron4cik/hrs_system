<?php

namespace App\Http\Requests;

use App\Rules\UzbekCity;
use Illuminate\Foundation\Http\FormRequest;

class HotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            'description'    => 'required|string',
            'city'           => ['required', 'string', new \App\Rules\UzbekCity],
            'country'        => 'required|string|in:Uzbekistan',
            'address'        => 'required|string|max:255',
            'star_rating'    => 'required|integer|min:1|max:5',
            'check_in_time'  => 'nullable|string',
            'check_out_time' => 'nullable|string',
            'amenities'      => 'nullable|array',
            'latitude'       => 'required|numeric|between:37.0,46.0',
            'longitude'      => 'required|numeric|between:55.0,74.0',
        ];
    }

    /** Force country to Uzbekistan always */
    protected function prepareForValidation(): void
    {
        $this->merge(['country' => 'Uzbekistan']);
    }
}
