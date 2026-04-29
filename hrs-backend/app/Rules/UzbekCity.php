<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UzbekCity implements ValidationRule
{
    public const CITIES = [
        'Tashkent', 'Samarkand', 'Bukhara', 'Namangan', 'Andijan',
        'Fergana', 'Nukus', 'Urgench', 'Termez', 'Navoi',
        'Karshi', 'Jizzakh', 'Gulistan', 'Chirchiq', 'Margilan',
        'Qo\'qon', 'Kokand', 'Angren', 'Almalyk', 'Bekabad',
        'Muborak', 'Shahrisabz', 'Kattaqo\'rg\'on', 'Denov',
        'Hazorasp', 'Khiva', 'Uchquduq', 'Zarafshon',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $normalized = array_map('strtolower', self::CITIES);
        if (!in_array(strtolower($value), $normalized)) {
            $fail("The :attribute must be a valid city in Uzbekistan.");
        }
    }
}
