<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\HotelImage;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Users ─────────────────────────────────────────────
        $superAdmin = User::create([
            'first_name' => 'Super',
            'last_name'  => 'Admin',
            'email'      => 'admin@hrs.com',
            'password'   => Hash::make('password'),
            'role'       => 'super_admin',
            'phone'      => '+1-555-0100',
        ]);

        $hotelAdmin = User::create([
            'first_name' => 'Hotel',
            'last_name'  => 'Manager',
            'email'      => 'manager@hrs.com',
            'password'   => Hash::make('password'),
            'role'       => 'hotel_admin',
            'phone'      => '+1-555-0200',
        ]);

        $guest = User::create([
            'first_name' => 'John',
            'last_name'  => 'Traveler',
            'email'      => 'guest@hrs.com',
            'password'   => Hash::make('password'),
            'role'       => 'guest',
            'phone'      => '+1-555-0300',
        ]);

        $guest2 = User::create([
            'first_name' => 'Sarah',
            'last_name'  => 'Explorer',
            'email'      => 'sarah@hrs.com',
            'password'   => Hash::make('password'),
            'role'       => 'guest',
            'phone'      => '+1-555-0400',
        ]);

        // ── 2. Hotels ─────────────────────────────────────────────
        $hotelsData = [
            [
                'name'        => 'The Grand Horizon',
                'city'        => 'New York',
                'country'     => 'USA',
                'address'     => '350 Fifth Avenue, Manhattan, NY 10118',
                'star_rating' => 5,
                'description' => 'A landmark luxury hotel in the heart of Manhattan offering stunning views of the city skyline. World-class dining, spa, and concierge services.',
                'amenities'   => ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Valet Parking', 'Concierge', 'Room Service'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
                'latitude'    => 40.7484,
                'longitude'   => -73.9967,
                'images'      => [
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
                    'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200&q=80',
                    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
                    'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'single',  'capacity' => 1, 'price_per_night' => 189, 'floor' => 1, 'bed_type' => 'queen',  'size_sqm' => 22],
                    ['room_number' => '201', 'room_type' => 'double',  'capacity' => 2, 'price_per_night' => 299, 'floor' => 2, 'bed_type' => 'king',   'size_sqm' => 35],
                    ['room_number' => '301', 'room_type' => 'suite',   'capacity' => 4, 'price_per_night' => 599, 'floor' => 3, 'bed_type' => 'king',   'size_sqm' => 75],
                    ['room_number' => '401', 'room_type' => 'deluxe',  'capacity' => 2, 'price_per_night' => 449, 'floor' => 4, 'bed_type' => 'king',   'size_sqm' => 50],
                    ['room_number' => '501', 'room_type' => 'twin',    'capacity' => 2, 'price_per_night' => 259, 'floor' => 5, 'bed_type' => 'twin',   'size_sqm' => 30],
                ],
            ],
            [
                'name'        => 'Azure Beach Resort',
                'city'        => 'Miami',
                'country'     => 'USA',
                'address'     => '1455 Ocean Drive, Miami Beach, FL 33139',
                'star_rating' => 5,
                'description' => 'Breathtaking beachfront resort with direct access to pristine white sands. Featuring an infinity pool, world-class spa, and oceanfront dining.',
                'amenities'   => ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Watersports'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
                'latitude'    => 25.7617,
                'longitude'   => -80.1918,
                'images'      => [
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'double',  'capacity' => 2, 'price_per_night' => 350, 'floor' => 1, 'bed_type' => 'king',  'size_sqm' => 40],
                    ['room_number' => '201', 'room_type' => 'suite',   'capacity' => 4, 'price_per_night' => 750, 'floor' => 2, 'bed_type' => 'king',  'size_sqm' => 90],
                    ['room_number' => '301', 'room_type' => 'deluxe',  'capacity' => 3, 'price_per_night' => 520, 'floor' => 3, 'bed_type' => 'queen', 'size_sqm' => 60],
                    ['room_number' => '401', 'room_type' => 'single',  'capacity' => 1, 'price_per_night' => 210, 'floor' => 4, 'bed_type' => 'queen', 'size_sqm' => 25],
                    ['room_number' => '501', 'room_type' => 'twin',    'capacity' => 2, 'price_per_night' => 280, 'floor' => 5, 'bed_type' => 'twin',  'size_sqm' => 32],
                ],
            ],
            [
                'name'        => 'The Parisian Elegance',
                'city'        => 'Paris',
                'country'     => 'France',
                'address'     => '12 Rue de la Paix, 75002 Paris',
                'star_rating' => 5,
                'description' => 'Nestled in the heart of Paris, this iconic hotel blends classic French architecture with contemporary luxury. Steps from the Eiffel Tower.',
                'amenities'   => ['WiFi', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking', 'Butler Service'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
                'latitude'    => 48.8698,
                'longitude'   => 2.3310,
                'images'      => [
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
                    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'double', 'capacity' => 2, 'price_per_night' => 420, 'floor' => 1, 'bed_type' => 'king',  'size_sqm' => 38],
                    ['room_number' => '201', 'room_type' => 'suite',  'capacity' => 2, 'price_per_night' => 890, 'floor' => 2, 'bed_type' => 'king',  'size_sqm' => 80],
                    ['room_number' => '301', 'room_type' => 'deluxe', 'capacity' => 2, 'price_per_night' => 580, 'floor' => 3, 'bed_type' => 'king',  'size_sqm' => 55],
                    ['room_number' => '401', 'room_type' => 'single', 'capacity' => 1, 'price_per_night' => 250, 'floor' => 4, 'bed_type' => 'queen', 'size_sqm' => 20],
                    ['room_number' => '501', 'room_type' => 'twin',   'capacity' => 2, 'price_per_night' => 320, 'floor' => 5, 'bed_type' => 'twin',  'size_sqm' => 28],
                ],
            ],
            [
                'name'        => 'Tokyo Sky Tower Hotel',
                'city'        => 'Tokyo',
                'country'     => 'Japan',
                'address'     => '1-1-2 Oshiage, Sumida, Tokyo 131-0045',
                'star_rating' => 4,
                'description' => 'A modern skyscraper hotel offering panoramic views of Tokyo. Experience authentic Japanese hospitality with contemporary amenities.',
                'amenities'   => ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Onsen', 'Business Center'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
                'latitude'    => 35.6762,
                'longitude'   => 139.6503,
                'images'      => [
                    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
                    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'single',  'capacity' => 1, 'price_per_night' => 150, 'floor' => 1, 'bed_type' => 'queen', 'size_sqm' => 18],
                    ['room_number' => '201', 'room_type' => 'double',  'capacity' => 2, 'price_per_night' => 230, 'floor' => 2, 'bed_type' => 'king',  'size_sqm' => 30],
                    ['room_number' => '301', 'room_type' => 'suite',   'capacity' => 3, 'price_per_night' => 480, 'floor' => 3, 'bed_type' => 'king',  'size_sqm' => 65],
                    ['room_number' => '401', 'room_type' => 'twin',    'capacity' => 2, 'price_per_night' => 200, 'floor' => 4, 'bed_type' => 'twin',  'size_sqm' => 26],
                    ['room_number' => '501', 'room_type' => 'deluxe',  'capacity' => 2, 'price_per_night' => 360, 'floor' => 5, 'bed_type' => 'king',  'size_sqm' => 45],
                ],
            ],
            [
                'name'        => 'Santorini Cliffside Suites',
                'city'        => 'Santorini',
                'country'     => 'Greece',
                'address'     => 'Oia Village, Santorini 847 02, Greece',
                'star_rating' => 5,
                'description' => 'Perched on volcanic cliffs with breathtaking caldera views. Iconic white-washed architecture, private plunge pools, and unforgettable sunsets.',
                'amenities'   => ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Airport Transfer', 'Concierge'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80',
                'latitude'    => 36.4618,
                'longitude'   => 25.3753,
                'images'      => [
                    'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=1200&q=80',
                    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'suite',  'capacity' => 2, 'price_per_night' => 650, 'floor' => 1, 'bed_type' => 'king', 'size_sqm' => 70],
                    ['room_number' => '201', 'room_type' => 'deluxe', 'capacity' => 2, 'price_per_night' => 480, 'floor' => 2, 'bed_type' => 'king', 'size_sqm' => 52],
                    ['room_number' => '301', 'room_type' => 'double', 'capacity' => 2, 'price_per_night' => 320, 'floor' => 3, 'bed_type' => 'king', 'size_sqm' => 36],
                    ['room_number' => '401', 'room_type' => 'single', 'capacity' => 1, 'price_per_night' => 195, 'floor' => 4, 'bed_type' => 'queen','size_sqm' => 20],
                    ['room_number' => '501', 'room_type' => 'twin',   'capacity' => 2, 'price_per_night' => 270, 'floor' => 5, 'bed_type' => 'twin', 'size_sqm' => 28],
                ],
            ],
            [
                'name'        => 'Dubai Desert Palace',
                'city'        => 'Dubai',
                'country'     => 'UAE',
                'address'     => 'Sheikh Zayed Road, Dubai, UAE',
                'star_rating' => 5,
                'description' => 'An ultra-luxury desert oasis rising above the Dubai skyline. Gold-adorned interiors, private butler service, and an award-winning rooftop restaurant.',
                'amenities'   => ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Valet Parking', 'Butler Service', 'Helipad'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
                'latitude'    => 25.2048,
                'longitude'   => 55.2708,
                'images'      => [
                    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'suite',  'capacity' => 3, 'price_per_night' => 900,  'floor' => 1, 'bed_type' => 'king', 'size_sqm' => 95],
                    ['room_number' => '201', 'room_type' => 'deluxe', 'capacity' => 2, 'price_per_night' => 620,  'floor' => 2, 'bed_type' => 'king', 'size_sqm' => 60],
                    ['room_number' => '301', 'room_type' => 'double', 'capacity' => 2, 'price_per_night' => 400,  'floor' => 3, 'bed_type' => 'king', 'size_sqm' => 40],
                    ['room_number' => '401', 'room_type' => 'single', 'capacity' => 1, 'price_per_night' => 250,  'floor' => 4, 'bed_type' => 'queen','size_sqm' => 22],
                    ['room_number' => '501', 'room_type' => 'twin',   'capacity' => 2, 'price_per_night' => 350,  'floor' => 5, 'bed_type' => 'twin', 'size_sqm' => 30],
                ],
            ],
            [
                'name'        => 'Barcelona Sea View',
                'city'        => 'Barcelona',
                'country'     => 'Spain',
                'address'     => 'Passeig de Colom 12, 08002 Barcelona',
                'star_rating' => 4,
                'description' => 'Stylish boutique hotel in the Gothic Quarter with Mediterranean Sea views. Walking distance from La Rambla, Picasso Museum, and Gothic Cathedral.',
                'amenities'   => ['WiFi', 'Pool', 'Restaurant', 'Bar', 'Gym', 'Rooftop Terrace'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
                'latitude'    => 41.3784,
                'longitude'   => 2.1925,
                'images'      => [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'double', 'capacity' => 2, 'price_per_night' => 220, 'floor' => 1, 'bed_type' => 'king',  'size_sqm' => 28],
                    ['room_number' => '201', 'room_type' => 'suite',  'capacity' => 4, 'price_per_night' => 480, 'floor' => 2, 'bed_type' => 'king',  'size_sqm' => 65],
                    ['room_number' => '301', 'room_type' => 'single', 'capacity' => 1, 'price_per_night' => 130, 'floor' => 3, 'bed_type' => 'queen', 'size_sqm' => 18],
                    ['room_number' => '401', 'room_type' => 'twin',   'capacity' => 2, 'price_per_night' => 180, 'floor' => 4, 'bed_type' => 'twin',  'size_sqm' => 25],
                    ['room_number' => '501', 'room_type' => 'deluxe', 'capacity' => 3, 'price_per_night' => 320, 'floor' => 5, 'bed_type' => 'king',  'size_sqm' => 42],
                ],
            ],
            [
                'name'        => 'Maldives Water Villas',
                'city'        => 'Malé',
                'country'     => 'Maldives',
                'address'     => 'North Malé Atoll, Maldives',
                'star_rating' => 5,
                'description' => 'Exclusive overwater bungalows in crystal-clear turquoise lagoons. Private decks with direct ocean access, glass floor panels, and coral reef snorkeling.',
                'amenities'   => ['WiFi', 'Private Pool', 'Snorkeling', 'Diving', 'Spa', 'Restaurant', 'Butler Service'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
                'latitude'    => 4.1755,
                'longitude'   => 73.5093,
                'images'      => [
                    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
                    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => 'W1',  'room_type' => 'suite',  'capacity' => 2, 'price_per_night' => 1200, 'floor' => 1, 'bed_type' => 'king',  'size_sqm' => 110],
                    ['room_number' => 'W2',  'room_type' => 'deluxe', 'capacity' => 2, 'price_per_night' => 850,  'floor' => 1, 'bed_type' => 'king',  'size_sqm' => 80],
                    ['room_number' => 'W3',  'room_type' => 'double', 'capacity' => 2, 'price_per_night' => 620,  'floor' => 1, 'bed_type' => 'queen', 'size_sqm' => 55],
                    ['room_number' => 'W4',  'room_type' => 'twin',   'capacity' => 2, 'price_per_night' => 540,  'floor' => 1, 'bed_type' => 'twin',  'size_sqm' => 50],
                    ['room_number' => 'W5',  'room_type' => 'suite',  'capacity' => 4, 'price_per_night' => 1800, 'floor' => 1, 'bed_type' => 'king',  'size_sqm' => 150],
                ],
            ],
            [
                'name'        => 'Singapore Marina Bay',
                'city'        => 'Singapore',
                'country'     => 'Singapore',
                'address'     => '10 Bayfront Avenue, Singapore 018956',
                'star_rating' => 5,
                'description' => 'Iconic hotel with the world-famous rooftop infinity pool overlooking the Singapore skyline. Extraordinary dining, luxury retail, and the ArtScience Museum nearby.',
                'amenities'   => ['WiFi', 'Infinity Pool', 'Gym', 'Spa', 'Restaurant', 'Casino Access', 'Shopping Mall'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
                'latitude'    => 1.2834,
                'longitude'   => 103.8607,
                'images'      => [
                    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
                    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'double', 'capacity' => 2, 'price_per_night' => 380, 'floor' => 1,  'bed_type' => 'king',  'size_sqm' => 35],
                    ['room_number' => '201', 'room_type' => 'suite',  'capacity' => 3, 'price_per_night' => 780, 'floor' => 20, 'bed_type' => 'king',  'size_sqm' => 80],
                    ['room_number' => '301', 'room_type' => 'deluxe', 'capacity' => 2, 'price_per_night' => 550, 'floor' => 30, 'bed_type' => 'king',  'size_sqm' => 55],
                    ['room_number' => '401', 'room_type' => 'single', 'capacity' => 1, 'price_per_night' => 220, 'floor' => 5,  'bed_type' => 'queen', 'size_sqm' => 22],
                    ['room_number' => '501', 'room_type' => 'twin',   'capacity' => 2, 'price_per_night' => 300, 'floor' => 10, 'bed_type' => 'twin',  'size_sqm' => 30],
                ],
            ],
            [
                'name'        => 'Tashkent Royal Palace',
                'city'        => 'Tashkent',
                'country'     => 'Uzbekistan',
                'address'     => '1 Amir Timur Square, Tashkent 100000',
                'star_rating' => 4,
                'description' => 'A premier business and leisure hotel in the heart of Uzbekistan\'s capital. Featuring ornate Silk Road-inspired decor, rooftop pool, and authentic Uzbek cuisine.',
                'amenities'   => ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Business Center', 'Airport Shuttle'],
                'thumbnail'   => 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&q=80',
                'latitude'    => 41.2995,
                'longitude'   => 69.2401,
                'images'      => [
                    'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=1200&q=80',
                    'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1200&q=80',
                ],
                'rooms' => [
                    ['room_number' => '101', 'room_type' => 'single',  'capacity' => 1, 'price_per_night' => 80,  'floor' => 1, 'bed_type' => 'queen', 'size_sqm' => 20],
                    ['room_number' => '201', 'room_type' => 'double',  'capacity' => 2, 'price_per_night' => 130, 'floor' => 2, 'bed_type' => 'king',  'size_sqm' => 32],
                    ['room_number' => '301', 'room_type' => 'suite',   'capacity' => 4, 'price_per_night' => 280, 'floor' => 3, 'bed_type' => 'king',  'size_sqm' => 70],
                    ['room_number' => '401', 'room_type' => 'twin',    'capacity' => 2, 'price_per_night' => 110, 'floor' => 4, 'bed_type' => 'twin',  'size_sqm' => 26],
                    ['room_number' => '501', 'room_type' => 'deluxe',  'capacity' => 3, 'price_per_night' => 190, 'floor' => 5, 'bed_type' => 'king',  'size_sqm' => 44],
                ],
            ],
        ];

        $roomAmenities = [
            'single'  => ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Minibar'],
            'double'  => ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Minibar', 'Bathtub', 'City View'],
            'twin'    => ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Minibar', 'Work Desk'],
            'suite'   => ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Minibar', 'Jacuzzi', 'Living Room', 'Panoramic View', 'Butler'],
            'deluxe'  => ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Minibar', 'Bathtub', 'Ocean View', 'Premium Toiletries'],
        ];

        $roomPhotos = [
            'single'  => ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
            'double'  => ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'],
            'twin'    => ['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'],
            'suite'   => ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'],
            'deluxe'  => ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'],
        ];

        $allRooms  = [];
        $hotelModels = [];

        foreach ($hotelsData as $idx => $hotelData) {
            $rooms    = $hotelData['rooms'];
            $images   = $hotelData['images'];
            unset($hotelData['rooms'], $hotelData['images']);

            $owner = ($idx % 3 === 0) ? $superAdmin : $hotelAdmin;

            $hotel = Hotel::create([
                ...$hotelData,
                'user_id'         => $owner->id,
                'check_in_time'   => '14:00:00',
                'check_out_time'  => '12:00:00',
            ]);

            // Gallery images
            foreach ($images as $i => $imgPath) {
                HotelImage::create([
                    'hotel_id'   => $hotel->id,
                    'image_path' => $imgPath,
                    'alt_text'   => $hotel->name . ' - Photo ' . ($i + 1),
                    'is_primary' => $i === 0,
                    'sort_order' => $i,
                ]);
            }

            // Rooms
            foreach ($rooms as $roomData) {
                $room = $hotel->rooms()->create([
                    ...$roomData,
                    'amenities' => $roomAmenities[$roomData['room_type']],
                    'photos'    => $roomPhotos[$roomData['room_type']],
                ]);
                $allRooms[] = $room;
            }

            $hotelModels[] = $hotel;
        }

        // ── 3. Reservations ───────────────────────────────────────
        $statuses   = ['confirmed', 'confirmed', 'confirmed', 'completed', 'completed', 'cancelled', 'pending'];
        $guests     = [$guest, $guest2];
        $today      = Carbon::today();

        $reservationCount = 0;
        foreach ($allRooms as $room) {
            if ($reservationCount >= 30) break;

            $guestUser   = $guests[$reservationCount % 2];
            $status      = $statuses[$reservationCount % count($statuses)];
            $daysOffset  = ($reservationCount % 5) * 10;

            if ($status === 'completed') {
                $checkIn  = $today->copy()->subDays($daysOffset + 10);
                $checkOut = $today->copy()->subDays($daysOffset + 7);
            } elseif ($status === 'cancelled') {
                $checkIn  = $today->copy()->subDays(5);
                $checkOut = $today->copy()->subDays(2);
            } else {
                $checkIn  = $today->copy()->addDays($daysOffset + 5);
                $checkOut = $today->copy()->addDays($daysOffset + 8);
            }

            $nights = $checkIn->diffInDays($checkOut);
            $total  = $nights * $room->price_per_night;

            $reservation = Reservation::create([
                'user_id'       => $guestUser->id,
                'room_id'       => $room->id,
                'check_in_date' => $checkIn->toDateString(),
                'check_out_date'=> $checkOut->toDateString(),
                'num_guests'    => min($room->capacity, rand(1, $room->capacity)),
                'total_price'   => $total,
                'status'        => $status,
            ]);

            $reservationCount++;
        }

        // ── 4. Reviews (only for completed reservations) ──────────
        $comments = [
            'Absolutely stunning hotel! The service was impeccable and the views were breathtaking. Will definitely return.',
            'Great location and comfortable rooms. Staff were friendly and helpful. Breakfast was excellent.',
            'A wonderful stay. The room was spacious and very clean. The amenities were top-notch.',
            'Perfect for a romantic getaway. The sunset views were magical and the food was delicious.',
            'Excellent value for money. Clean rooms, great service, and a fantastic location.',
            'Beautiful property with amazing facilities. The spa was particularly wonderful.',
            'We had a memorable family vacation here. Kids loved the pool and the staff were great with children.',
        ];

        $completedReservations = Reservation::where('status', 'completed')->get();
        foreach ($completedReservations as $ci => $res) {
            $hotel = $res->room->hotel;
            Review::create([
                'user_id'        => $res->user_id,
                'hotel_id'       => $hotel->id,
                'reservation_id' => $res->id,
                'rating'         => rand(4, 5),
                'cleanliness'    => rand(4, 5),
                'service'        => rand(4, 5),
                'location'       => rand(3, 5),
                'comment'        => $comments[$ci % count($comments)],
            ]);
        }

        $this->command->info('✅ HRS Database seeded successfully!');
        $this->command->info("   👤 Accounts created:");
        $this->command->info("      admin@hrs.com     / password  (Super Admin)");
        $this->command->info("      manager@hrs.com   / password  (Hotel Admin)");
        $this->command->info("      guest@hrs.com     / password  (Guest)");
        $this->command->info("      sarah@hrs.com     / password  (Guest)");
        $this->command->info("   🏨 " . count($hotelsData) . " hotels, " . count($allRooms) . " rooms, " . $reservationCount . " reservations seeded.");
    }
}
