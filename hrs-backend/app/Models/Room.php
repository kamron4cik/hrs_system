<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'room_number',
        'room_type',
        'capacity',
        'price_per_night',
        'floor',
        'bed_type',
        'size_sqm',
        'amenities',
        'photos',
        'is_available',
    ];

    protected $casts = [
        'amenities'       => 'array',
        'photos'          => 'array',
        'is_available'    => 'boolean',
        'price_per_night' => 'float',
        'capacity'        => 'integer',
        'floor'           => 'integer',
        'size_sqm'        => 'integer',
    ];

    // ── Relationships ─────────────────────────────────────
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    // ── Helpers ──────────────────────────────────────────
    /**
     * Check if room is available for given date range.
     */
    public function isAvailableFor(string $checkIn, string $checkOut): bool
    {
        if (!$this->is_available) {
            return false;
        }

        return !$this->reservations()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('check_in_date', '<', $checkOut)
            ->where('check_out_date', '>', $checkIn)
            ->exists();
    }
}
