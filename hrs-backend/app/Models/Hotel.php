<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'city',
        'country',
        'address',
        'star_rating',
        'check_in_time',
        'check_out_time',
        'amenities',
        'thumbnail',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected $casts = [
        'description' => 'json',
        'amenities'   => 'array',
        'is_active'   => 'boolean',
        'latitude'    => 'float',
        'longitude'   => 'float',
        'star_rating' => 'integer',
    ];

    // ── Relationships ─────────────────────────────────────
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function availableRooms(): HasMany
    {
        return $this->hasMany(Room::class)->where('is_available', true);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(HotelImage::class)->orderBy('sort_order');
    }

    // ── Accessors ──────────────────────────────────────────
    public function getAverageRatingAttribute(): ?float
    {
        $avg = $this->reviews()->avg('rating');
        return $avg ? round($avg, 1) : null;
    }

    public function getPriceFromAttribute(): ?float
    {
        return $this->rooms()->where('is_available', true)->min('price_per_night');
    }
}
