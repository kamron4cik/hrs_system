import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { UsersIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';

const RoomCard = ({ room, hotelId, checkIn, checkOut, guests }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/hotels/${hotelId}/book/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="hrs-card flex flex-col md:flex-row overflow-hidden group">
      {/* Photo */}
      <div className="w-full md:w-52 h-48 md:h-auto flex-shrink-0 overflow-hidden">
        <img
          src={room.photos?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80'}
          alt={`${room.room_type} room`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-display text-alabaster text-xl capitalize mb-2 group-hover:text-gold transition-colors duration-300">
            {room.room_type} Room
          </h4>
          <div className="flex flex-wrap gap-4 text-xs text-alabaster/50 mb-4">
            <span className="flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5 text-gold/60" />
              Max {room.capacity} guests
            </span>
            <span className="flex items-center gap-1.5">
              <SparklesIcon className="w-3.5 h-3.5 text-gold/60" />
              {room.size_sqm} m²
            </span>
            <span className="capitalize">{room.bed_type} Bed</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities?.slice(0, 5).map((amenity, idx) => (
              <span key={idx} className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-full text-[10px] text-alabaster/60">
                <CheckIcon className="w-3 h-3 text-gold/60 flex-shrink-0" />
                {amenity}
              </span>
            ))}
            {room.amenities?.length > 5 && (
              <span className="text-[10px] text-gold/60 px-2 py-1">+{room.amenities.length - 5} more</span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-5 border-t border-white/5">
          <div className="text-emerald-400/70 text-xs space-y-1">
            <p className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Free cancellation</p>
            <p className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No prepayment needed</p>
          </div>
          <div className="text-right">
            <p className="font-body text-[10px] uppercase tracking-wider text-alabaster/30 mb-1">Price / night</p>
            <p className="font-display text-gold text-2xl leading-none">{formatPrice(room.price_per_night)}</p>
            <button
              onClick={handleBook}
              className="btn-gold !px-6 !py-2.5 !text-[10px] mt-3"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
