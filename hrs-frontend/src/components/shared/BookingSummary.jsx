import React from 'react';
import { formatPrice, formatDate, calculateNights } from '../../utils/helpers';

const BookingSummary = ({ hotel, room, checkIn, checkOut, guests }) => {
  const nights = calculateNights(checkIn, checkOut);
  const basePrice = room?.price_per_night * nights || 0;
  const taxesAndFees = basePrice * 0.12; // 12% tax sim
  const total = basePrice + taxesAndFees;

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral overflow-hidden sticky top-24">
       <div className="p-4 bg-blue-50 border-b border-neutral">
         <h3 className="font-bold text-lg text-primary">Your booking details</h3>
       </div>
       
       <div className="p-4 border-b border-neutral flex gap-4">
         <img src={hotel?.thumbnail} alt={hotel?.name} className="w-20 h-20 object-cover rounded shadow-sm" />
         <div>
            <h4 className="font-bold text-text-primary text-sm line-clamp-2">{hotel?.name}</h4>
            <p className="text-xs text-text-secondary mt-1">{hotel?.city}, {hotel?.country}</p>
         </div>
       </div>

       <div className="p-4 border-b border-neutral flex justify-between">
          <div>
            <p className="text-xs text-text-secondary">Check-in</p>
            <p className="font-bold text-sm">{formatDate(checkIn)}</p>
            <p className="text-xs text-text-secondary">From 14:00</p>
          </div>
          <div className="border-l border-neutral mx-2"></div>
          <div>
            <p className="text-xs text-text-secondary">Check-out</p>
            <p className="font-bold text-sm">{formatDate(checkOut)}</p>
            <p className="text-xs text-text-secondary">By 12:00</p>
          </div>
       </div>

       <div className="p-4 border-b border-neutral">
         <p className="text-sm">Total length of stay:</p>
         <p className="font-bold">{nights} night{nights > 1 ? 's' : ''}</p>
       </div>

       <div className="p-4 bg-gray-50 border-b border-neutral">
         <h4 className="font-bold text-sm mb-2 text-text-primary">You selected:</h4>
         <p className="text-sm text-text-secondary capitalize">{room?.room_type} Room</p>
         <p className="text-sm text-text-secondary">{guests} Guest{guests > 1 ? 's' : ''}</p>
       </div>

       <div className="p-4 bg-blue-50">
          <h3 className="font-bold text-lg text-primary mb-4">Your price summary</h3>
          <div className="flex justify-between text-sm mb-2 text-text-secondary">
             <span>{formatPrice(room?.price_per_night)} x {nights} nights</span>
             <span>{formatPrice(basePrice)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-text-secondary">
             <span>Taxes and fees (12%)</span>
             <span>{formatPrice(taxesAndFees)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-blue-200">
             <span className="font-bold text-xl text-primary">Price</span>
             <span className="font-bold text-2xl text-primary">{formatPrice(total)}</span>
          </div>
       </div>
    </div>
  );
};

export default BookingSummary;
