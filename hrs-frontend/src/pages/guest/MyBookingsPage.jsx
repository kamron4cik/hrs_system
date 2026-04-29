import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getReservations, cancelReservation } from '../../api/reservations';
import { useRefresh } from '../../context/RefreshContext';
import { formatPrice, formatDate } from '../../utils/helpers';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        confirmed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800',
    };
    
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const MyBookingsPage = () => {
    const { refreshSignal, triggerRefresh } = useRefresh();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await getReservations();
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            toast.error("Failed to load your reservations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [refreshSignal]);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            await cancelReservation(id);
            toast.success("Booking cancelled successfully.");
            triggerRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel booking.");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="bg-neutral-light min-h-screen py-10 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-text-primary mb-8">My Bookings</h1>

                {bookings.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🧳</span>
                        </div>
                        <h2 className="text-xl font-bold text-text-primary mb-2">No bookings yet</h2>
                        <p className="text-text-secondary mb-6">Looks like you haven't made any reservations yet.</p>
                        <Link to="/" className="px-6 py-2 bg-secondary text-white rounded font-medium hover:bg-primary transition">
                            Start Exploring
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-neutral overflow-hidden flex flex-col md:flex-row">
                                <div className="md:w-1/4 h-40 md:h-auto overflow-hidden">
                                    <img 
                                        src={booking.room?.hotel?.thumbnail} 
                                        alt={booking.room?.hotel?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 md:w-3/4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-primary">{booking.room?.hotel?.name}</h3>
                                                <p className="text-sm text-text-secondary">{booking.room?.hotel?.city}, {booking.room?.hotel?.country}</p>
                                            </div>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                            <div>
                                                <p className="text-text-secondary text-xs">Check-in</p>
                                                <p className="font-semibold">{formatDate(booking.check_in_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-text-secondary text-xs">Check-out</p>
                                                <p className="font-semibold">{formatDate(booking.check_out_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-text-secondary text-xs">Confirmation #</p>
                                                <p className="font-mono bg-gray-100 px-1 rounded">{booking.confirmation_code}</p>
                                            </div>
                                            <div>
                                                <p className="text-text-secondary text-xs">Total Price</p>
                                                <p className="font-bold text-primary">{formatPrice(booking.total_price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end gap-3 border-t border-neutral pt-4">
                                        <Link 
                                            to={`/hotels/${booking.room?.hotel_id}`}
                                            className="px-4 py-2 border border-secondary text-secondary rounded font-medium hover:bg-neutral transition text-sm"
                                        >
                                            View Hotel
                                        </Link>
                                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                            <button 
                                                onClick={() => handleCancel(booking.id)}
                                                className="px-4 py-2 bg-white text-error border border-error rounded font-medium hover:bg-red-50 transition text-sm"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
