import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

const HotelCard = ({ hotel }) => {
  const { format } = useCurrency();
  const { t, i18n } = useTranslation();

  const description = typeof hotel.description === 'object'
    ? (hotel.description[i18n.language] || hotel.description['en'] || Object.values(hotel.description)[0])
    : hotel.description;

  return (
    <div className="hrs-card overflow-hidden flex flex-col md:flex-row h-full md:h-64 group">
      {/* ── Thumbnail ── */}
      <div className="w-full md:w-72 h-52 md:h-full flex-shrink-0 overflow-hidden relative">
        <img
          src={hotel.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80'}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Rating badge */}
        {hotel.average_rating > 0 && (
          <div className="absolute top-3 left-3 bg-gold text-void text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            ★ {hotel.average_rating}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Name & Stars */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-alabaster text-xl group-hover:text-gold transition-colors duration-300">
              {hotel.name}
            </h3>
            <div className="flex text-gold flex-shrink-0 pt-0.5">
              {[...Array(hotel.star_rating)].map((_, i) => (
                <StarSolid key={i} className="w-3.5 h-3.5" />
              ))}
            </div>
          </div>

          {/* Location */}
          <p className="font-body text-[11px] uppercase tracking-[0.15em] text-gold/70 mb-3">
            📍 {hotel.city}, {hotel.country}
          </p>

          {/* Description */}
          <p className="font-body text-alabaster/40 text-xs leading-relaxed line-clamp-2 italic">
            {description}
          </p>
        </div>

        {/* ── Footer row ── */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-body text-[9px] uppercase tracking-[0.12em] text-emerald-400/80 bg-emerald-400/10 px-2.5 py-1 rounded-full">
              {t('hotel.freeCancellation')}
            </span>
            {hotel.review_count > 0 && (
              <span className="font-body text-[9px] uppercase tracking-[0.1em] text-alabaster/30">
                {hotel.review_count} {t('hotel.reviews')}
              </span>
            )}
          </div>

          <div className="text-right flex items-end gap-4">
            {hotel.price_from ? (
              <div>
                <p className="font-body text-[10px] text-alabaster/30">{t('hotel.startingFrom')}</p>
                <p className="font-display text-gold text-2xl leading-none">{format(hotel.price_from)}</p>
                <p className="font-body text-[9px] text-alabaster/25 mt-0.5">{t('hotel.taxesIncluded')}</p>
              </div>
            ) : (
              <p className="font-body text-red-400/80 text-xs">{t('hotel.soldOut')}</p>
            )}
            <Link
              to={`/hotels/${hotel.id}`}
              className="btn-gold !px-5 !py-2.5 !text-[10px] flex-shrink-0"
            >
              {t('hotel.seeAvailability')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
