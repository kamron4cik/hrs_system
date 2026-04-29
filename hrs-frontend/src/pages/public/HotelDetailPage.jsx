import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { MapPinIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { getHotel, getHotelRooms } from '../../api/hotels';
import { useSearch } from '../../hooks/useSearch';
import SearchBar from '../../components/shared/SearchBar';
import RoomCard from '../../components/shared/RoomCard';
import ReviewCard from '../../components/shared/ReviewCard';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const HotelMap = lazy(() => import('../../components/ui/HotelMap'));

const HotelDetailPage = () => {
  const { id } = useParams();
  const { searchParams } = useSearch();
  const { t, i18n } = useTranslation();
  const [hotel,   setHotel]   = useState(null);
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const [hotelRes, roomsRes] = await Promise.all([
          getHotel(id),
          getHotelRooms(id, {
            check_in:  searchParams.checkIn  ? format(searchParams.checkIn,  'yyyy-MM-dd') : null,
            check_out: searchParams.checkOut ? format(searchParams.checkOut, 'yyyy-MM-dd') : null,
            guests:    searchParams.guests,
          }),
        ]);
        setHotel(hotelRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        console.error('Failed to load hotel detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id, searchParams]);

  const description = hotel && (
    typeof hotel.description === 'object'
      ? (hotel.description[i18n.language] || hotel.description['en'] || Object.values(hotel.description)[0])
      : hotel.description
  );

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <p className="font-display text-alabaster/40 text-2xl">Hotel not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-void text-alabaster">

      {/* Search modifier band */}
      <div className="pt-24 pb-6 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <SearchBar horizontal={true} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-alabaster text-3xl md:text-4xl">{hotel.name}</h1>
              <div className="flex text-gold">
                {[...Array(hotel.star_rating)].map((_, i) => (
                  <StarSolid key={i} className="w-4 h-4" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-alabaster/40 text-sm">
              <MapPinIcon className="w-4 h-4 text-gold/60" />
              <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
            </div>
          </div>
          {hotel.average_rating > 0 && (
            <div className="glass rounded-2xl px-5 py-3 text-center flex-shrink-0">
              <p className="font-display text-gold text-3xl">{hotel.average_rating}</p>
              <p className="section-label mt-1">Exceptional</p>
              <p className="font-body text-[10px] text-alabaster/30 mt-0.5">{hotel.review_count} reviews</p>
            </div>
          )}
        </div>

        {/* ── Image Gallery ── */}
        <div className="grid grid-cols-3 gap-3 h-80 md:h-96 mb-10 rounded-2xl overflow-hidden">
          <div className="col-span-2 h-full overflow-hidden">
            <img
              src={hotel.images?.[0]?.image_path || hotel.thumbnail}
              alt="Main"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
            />
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-3 h-full">
            {[1, 2].map(idx => (
              <div key={idx} className="overflow-hidden">
                <img
                  src={hotel.images?.[idx]?.image_path || hotel.thumbnail}
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Body Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left column */}
          <div className="lg:w-2/3 space-y-8">

            {/* Description */}
            <div className="hrs-card p-7">
              <h2 className="font-display text-alabaster text-xl mb-4">{t('hotel.description')}</h2>
              <p className="font-body text-alabaster/50 text-sm leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <div className="hrs-card p-7">
                <h2 className="font-display text-alabaster text-xl mb-5">Most Popular Facilities</h2>
                <div className="flex flex-wrap gap-3">
                  {hotel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                      <CheckIcon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span className="font-body text-xs text-alabaster/70">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div id="rooms">
              <h2 className="font-display text-alabaster text-2xl mb-5">
                Availability
              </h2>
              {!searchParams.checkIn || !searchParams.checkOut ? (
                <div className="glass rounded-2xl p-6 border border-gold/15">
                  <p className="font-body text-alabaster/50 text-sm">
                    ⚡ Select check-in and check-out dates above to view available rooms and prices.
                  </p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="glass rounded-2xl p-6 border border-red-400/20">
                  <p className="font-body text-red-400/70 text-sm">
                    No available rooms for your selected dates. Please try different dates.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map(room => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      hotelId={hotel.id}
                      checkIn={format(searchParams.checkIn, 'yyyy-MM-dd')}
                      checkOut={format(searchParams.checkOut, 'yyyy-MM-dd')}
                      guests={searchParams.guests}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div id="map-section">
              <h2 className="font-display text-alabaster text-xl mb-5">{t('hotel.location')}</h2>
              <div className="hrs-card overflow-hidden rounded-2xl">
                <Suspense fallback={<div className="skeleton h-72 rounded-2xl" />}>
                  <HotelMap hotel={hotel} />
                </Suspense>
              </div>
            </div>

            {/* Reviews */}
            {hotel.reviews?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-alabaster text-2xl">Guest Reviews</h2>
                  <div className="glass rounded-xl px-4 py-2">
                    <span className="font-display text-gold text-xl">{hotel.average_rating}</span>
                    <span className="font-body text-[10px] text-alabaster/40 ml-2 uppercase tracking-wider">/ 10</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.reviews.slice(0, 4).map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column – Property Highlights */}
          <div className="lg:w-1/3">
            <div className="glass rounded-2xl p-6 sticky top-28 space-y-5">
              <h3 className="font-display text-alabaster text-xl">Property Highlights</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="font-body text-alabaster/50 leading-relaxed">
                    <span className="text-alabaster/80 font-medium">Top Location: </span>
                    Highly rated by recent guests ({hotel.average_rating || '9.0'})
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="font-body text-alabaster/50 leading-relaxed">
                    <span className="text-alabaster/80 font-medium">Breakfast info: </span>
                    Continental, Vegetarian, Buffet
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-5">
                {hotel.price_from && (
                  <div className="mb-4">
                    <p className="font-body text-[10px] uppercase tracking-wider text-alabaster/30 mb-1">Starting from</p>
                    <p className="font-display text-gold text-3xl">{hotel.price_from}$</p>
                    <p className="font-body text-[10px] text-alabaster/25">per night</p>
                  </div>
                )}
                <button
                  onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-gold w-full !py-3.5 !rounded-xl"
                >
                  Reserve Your Stay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
