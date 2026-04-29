import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../../utils/helpers';

const BookingSuccessPage = () => {
    const location = useLocation();
    const reservation = location.state?.reservation;

    if (!reservation) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-neutral-light py-16 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-neutral p-8 text-center">
                <CheckCircleIcon className="w-20 h-20 text-success mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-text-primary mb-2">Booking Confirmed!</h1>
                <p className="text-text-secondary mb-8">Thank you. Your reservation has been successfully received.</p>

                <div className="bg-blue-50 border border-blue-200 rounded p-6 mb-8 text-left">
                    <h2 className="font-bold text-primary mb-4 text-lg border-b border-blue-200 pb-2">Booking Details</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-text-secondary">Confirmation Number</p>
                            <p className="font-bold text-lg text-text-primary">{reservation.confirmation_code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Status</p>
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs mt-1 uppercase">
                                {reservation.status}
                            </span>
                        </div>
                        <div className="col-span-2 mt-2">
                             <p className="text-sm text-text-secondary">Hotel</p>
                             <p className="font-bold text-text-primary">{reservation.room?.hotel?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Check-in</p>
                            <p className="font-medium text-text-primary">{reservation.check_in_date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Check-out</p>
                            <p className="font-medium text-text-primary">{reservation.check_out_date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Room Type</p>
                            <p className="font-medium text-text-primary capitalize">{reservation.room?.room_type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Total Price</p>
                            <p className="font-bold text-text-primary">{formatPrice(reservation.total_price)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/account/bookings" className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-opacity-90 transition">
                        View My Bookings
                    </Link>
                    <Link to="/" className="px-6 py-2 bg-white text-primary border border-primary rounded font-medium hover:bg-neutral-light transition">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
