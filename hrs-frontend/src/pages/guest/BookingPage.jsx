import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getHotel } from '../../api/hotels';
import { createReservation } from '../../api/reservations';
import { useAuth } from '../../hooks/useAuth';
import BookingSummary from '../../components/shared/BookingSummary';

const BookingPage = () => {
  const { id, roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();
  
  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests') || 1;

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [detectedCardType, setDetectedCardType] = useState('Unknown');

  const handleCardNumberChange = (e) => {
      const val = e.target.value.replace(/\D/g, '');
      setCardNumber(val);
      
      if (val.startsWith("8600")) setDetectedCardType("uzcard");
      else if (val.startsWith("9860")) setDetectedCardType("humo");
      else if (val.startsWith("4")) setDetectedCardType("visa");
      else {
          const firstTwo = parseInt(val.substring(0, 2));
          const firstFour = parseInt(val.substring(0, 4));
          
          if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) {
              setDetectedCardType("mastercard");
          } else {
              setDetectedCardType("Unknown");
          }
      }
  };

  useEffect(() => {
     if (!checkIn || !checkOut) {
         toast.error("Missing booking dates.");
         navigate(`/hotels/${id}`);
         return;
     }

     const fetchDetails = async () => {
         try {
             // We can fetch hotel details and pinpoint the room in memory
             // Realistically, you might have a dedicated endpoint for room detail.
             const res = await getHotel(id);
             setHotel(res.data);
             const targetRoom = res.data.rooms.find(r => r.id === parseInt(roomId));
             if (!targetRoom) {
                 toast.error("Room not found.");
                 navigate(-1);
             }
             setRoom(targetRoom);
         } catch(e) {
             console.error(e);
             toast.error("Failed to load booking details.");
         } finally {
             setLoading(false);
         }
     }
     fetchDetails();
  }, [id, roomId, checkIn, checkOut, navigate]);

  const onSubmit = async (data) => {
      try {
          if (paymentMethod === 'card' && cardNumber.length < 16) {
              toast.error("Please enter a valid 16-digit card number.");
              return;
          }

          if (paymentMethod === 'card') {
              toast.loading(`Processing ${detectedCardType.toUpperCase()} payment...`, { duration: 2000 });
              await new Promise(resolve => setTimeout(resolve, 2000));
          } else if (paymentMethod === 'paypal') {
              toast.loading("Redirecting to PayPal gateway...", { duration: 2000 });
              await new Promise(resolve => setTimeout(resolve, 2000));
          }

          setSubmitting(true);
          const payload = {
              room_id: room.id,
              check_in_date: checkIn,
              check_out_date: checkOut,
              num_guests: guests,
              special_requests: data.special_requests,
              payment_method: paymentMethod,
              card_type: paymentMethod === 'card' ? detectedCardType : null
          };
          
          const res = await createReservation(payload);
          toast.success("Booking confirmed!");
          navigate('/booking/success', { state: { reservation: res.data } });
          
      } catch (err) {
          toast.error(err.response?.data?.message || err.message || "Failed to create booking");
      } finally {
          setSubmitting(false);
      }
  };

  if (loading) return <div className="min-h-screen flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="bg-neutral-light min-h-screen py-10 px-4">
       <div className="container mx-auto max-w-6xl">
           <div className="flex flex-col lg:flex-row gap-8">
               
               {/* Left Column - Form */}
               <div className="lg:w-2/3">
                  <h1 className="text-3xl font-bold text-text-primary mb-6">Complete your booking</h1>
                  
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white rounded-lg shadow-sm border border-neutral p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Enter your details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                                <input type="text" value={user?.first_name || ''} readOnly className="w-full border border-neutral rounded px-3 py-2 bg-gray-50 text-text-secondary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                                <input type="text" value={user?.last_name || ''} readOnly className="w-full border border-neutral rounded px-3 py-2 bg-gray-50 text-text-secondary" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                                <input type="email" value={user?.email || ''} readOnly className="w-full border border-neutral rounded px-3 py-2 bg-gray-50 text-text-secondary" />
                                <p className="text-xs text-text-secondary mt-1">Confirmation email goes to this address.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Payment Details</h2>

                        {/* Card logos row */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-sm text-text-secondary font-medium">We accept:</span>
                            <img src="/visa.svg" alt="Visa" className="h-6 object-contain" />
                            <img src="/mastercard.svg" alt="Mastercard" className="h-6 object-contain" />
                            <img src="/uzcard.svg" alt="UzCard" className="h-6 object-contain" />
                            <img src="/humo.svg" alt="Humo" className="h-6 object-contain" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            {/* Credit Card option */}
                            <label className={`cursor-pointer flex-1 border rounded-lg p-4 text-center transition ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-neutral hover:bg-gray-50'}`}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                <div className="flex justify-center items-center gap-1 mb-2">
                                    <img src="/visa.svg" alt="Visa" className="h-5 object-contain" />
                                    <img src="/mastercard.svg" alt="Mastercard" className="h-5 object-contain" />
                                    <img src="/uzcard.svg" alt="UzCard" className="h-5 object-contain" />
                                    <img src="/humo.svg" alt="Humo" className="h-5 object-contain" />
                                </div>
                                <span className="font-bold block">Credit/Debit Card</span>
                                <span className="text-xs text-text-secondary">Pay securely</span>
                            </label>

                            {/* PayPal option */}
                            <label className={`cursor-pointer flex-1 border rounded-lg p-4 text-center transition ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5 shadow-md' : 'border-neutral hover:bg-gray-50'}`}>
                                <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="hidden" />
                                <div className="flex justify-center items-center mb-2">
                                    <img src="/paypal.svg" alt="PayPal" className="h-7 object-contain" />
                                </div>
                                <span className="font-bold block">PayPal</span>
                                <span className="text-xs text-text-secondary">International payments</span>
                            </label>

                            {/* Cash option */}
                            <label className={`cursor-pointer flex-1 border rounded-lg p-4 text-center transition ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 shadow-md' : 'border-neutral hover:bg-gray-50'}`}>
                                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden" />
                                <div className="flex justify-center items-center mb-2 h-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>
                                </div>
                                <span className="font-bold block">Cash at Hotel</span>
                                <span className="text-xs text-text-secondary">Pay at arrival</span>
                            </label>
                        </div>

                        {/* Card input fields */}
                        {paymentMethod === 'card' && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-neutral animate-fadeIn">
                                {/* Detected card logo */}
                                {detectedCardType !== 'Unknown' && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm text-text-secondary">Detected:</span>
                                        {detectedCardType === 'visa' && <img src="/visa.svg" alt="Visa" className="h-6 object-contain" />}
                                        {detectedCardType === 'mastercard' && <img src="/mastercard.svg" alt="Mastercard" className="h-6 object-contain" />}
                                        {detectedCardType === 'uzcard' && <img src="/uzcard.svg" alt="UzCard" className="h-6 object-contain" />}
                                        {detectedCardType === 'humo' && <img src="/humo.svg" alt="Humo" className="h-6 object-contain" />}
                                    </div>
                                )}
                                <div className="mb-4 relative">
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Card Number</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            maxLength="16" 
                                            placeholder="0000 0000 0000 0000" 
                                            value={cardNumber} 
                                            onChange={handleCardNumberChange} 
                                            className="w-full border border-neutral rounded px-3 py-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-secondary"
                                        />
                                    </div>
                                    <p className="text-xs text-text-secondary mt-1">Start typing to detect your card network automatically.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full border border-neutral rounded px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">CVC</label>
                                        <input type="password" placeholder="123" maxLength="3" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="w-full border border-neutral rounded px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-secondary" />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {paymentMethod === 'paypal' && (
                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 text-center animate-fadeIn">
                                <div className="flex justify-center mb-3">
                                    <img src="/paypal.svg" alt="PayPal" className="h-10 object-contain" />
                                </div>
                                <h3 className="font-bold text-blue-800">You will be redirected to PayPal</h3>
                                <p className="text-sm text-blue-600 mt-2">After confirming, you will be sent securely to PayPal to complete your payment.</p>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="bg-green-50 rounded-lg p-6 border border-green-100 text-center animate-fadeIn">
                                <div className="flex justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-green-800">Pay at the property</h3>
                                <p className="text-sm text-green-600 mt-2">Your booking will be saved securely. Present cash or card at the front desk when you arrive.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Special requests</h2>
                        <p className="text-sm text-text-secondary mb-2">Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can always make a special request after your booking is complete!</p>
                        <textarea 
                           {...register('special_requests')}
                           rows="4"
                           className="w-full border border-neutral rounded p-3 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                           placeholder="Please write your requests in English or the property's language. (optional)"
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="bg-secondary hover:bg-primary transition text-white font-bold text-lg px-8 py-4 rounded shadow-md disabled:bg-gray-400"
                        >
                            {submitting ? 'Confirming...' : 'Complete Bookings'}
                        </button>
                    </div>
                  </form>
               </div>

               {/* Right Column - Summary */}
               <div className="lg:w-1/3">
                   <BookingSummary hotel={hotel} room={room} checkIn={checkIn} checkOut={checkOut} guests={guests} />
               </div>
           </div>
       </div>
    </div>
  );
};

export default BookingPage;
