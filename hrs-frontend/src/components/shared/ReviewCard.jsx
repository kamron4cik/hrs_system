import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { formatDate } from '../../utils/helpers';

const ReviewCard = ({ review }) => {
  return (
    <div className="hrs-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center font-bold text-gold text-sm">
            {review.user?.first_name?.[0] || 'G'}
          </div>
          <div>
            <h4 className="font-body text-alabaster text-sm font-semibold">
              {review.user?.first_name || 'Guest'} {review.user?.last_name?.[0] || ''}.
            </h4>
            <p className="font-body text-[10px] text-alabaster/30">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="glass px-2.5 py-1 rounded-lg text-gold font-display text-lg leading-none">
            {review.rating?.toFixed(1)}
          </div>
          <div className="flex mt-1 justify-end text-gold/70">
            {[...Array(Math.round(review.rating))].map((_, i) => (
              <StarSolid key={i} className="w-2.5 h-2.5" />
            ))}
          </div>
        </div>
      </div>

      <p className="font-body text-alabaster/50 text-xs leading-relaxed italic mb-4">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
        {[
          { label: 'Cleanliness', val: review.cleanliness || review.rating },
          { label: 'Service',     val: review.service     || review.rating },
          { label: 'Location',    val: review.location    || review.rating },
        ].map(({ label, val }) => (
          <div key={label} className="text-center">
            <span className="block font-body text-[9px] uppercase tracking-wider text-alabaster/30 mb-1">{label}</span>
            <span className="font-display text-gold text-sm">{val}.0</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
