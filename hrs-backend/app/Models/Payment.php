<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'amount',
        'payment_method',
        'card_type',
        'status',
        'transaction_id',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'booking_id');
    }
}
