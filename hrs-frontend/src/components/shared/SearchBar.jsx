import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MagnifyingGlassIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ horizontal = true }) => {
  const { searchParams, updateSearch } = useSearch();
  const navigate = useNavigate();

  const [localCity,  setLocalCity]  = useState(searchParams.city);
  const [dateRange,  setDateRange]  = useState([searchParams.checkIn, searchParams.checkOut]);
  const [localGuests, setLocalGuests] = useState(searchParams.guests);
  const [startDate, endDate] = dateRange;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!localCity || !startDate || !endDate) {
      alert('Please fill in destination, check-in and check-out dates.');
      return;
    }
    updateSearch({ city: localCity, checkIn: startDate, checkOut: endDate, guests: localGuests });
    navigate('/hotels');
  };

  const dateLabel = startDate && endDate
    ? `${startDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
    : 'Check-in – Check-out';

  return (
    <form
      onSubmit={handleSearch}
      className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
    >
      <div className={`flex ${horizontal ? 'flex-col md:flex-row' : 'flex-col'} items-stretch`}>

        {/* ── City ── */}
        <div className={`flex items-center px-6 py-5 gap-3 ${horizontal ? 'md:flex-1 border-b md:border-b-0 md:border-r' : 'border-b'} border-white/6`}>
          <MagnifyingGlassIcon className="h-4 w-4 text-gold flex-shrink-0 opacity-70" />
          <input
            type="text"
            placeholder="Where are you going?"
            className="w-full bg-transparent text-alabaster text-sm placeholder:text-alabaster/30 focus:outline-none font-body"
            value={localCity}
            onChange={e => setLocalCity(e.target.value)}
          />
        </div>

        {/* ── Dates ── */}
        <div className={`flex items-center px-6 py-5 gap-3 ${horizontal ? 'md:flex-1 border-b md:border-b-0 md:border-r' : 'border-b'} border-white/6 relative`}>
          <CalendarIcon className="h-4 w-4 text-gold flex-shrink-0 opacity-70" />
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={update => setDateRange(update)}
            minDate={new Date()}
            className="w-full bg-transparent text-alabaster text-sm placeholder:text-alabaster/30 focus:outline-none font-body cursor-pointer"
            placeholderText="Check-in – Check-out"
            dateFormat="MMM d"
          />
        </div>

        {/* ── Guests ── */}
        <div className={`flex items-center px-6 py-5 gap-3 ${horizontal ? 'md:w-48 border-b md:border-b-0 md:border-r' : 'border-b'} border-white/6`}>
          <UserIcon className="h-4 w-4 text-gold flex-shrink-0 opacity-70" />
          <span className="text-alabaster/60 text-sm flex-1 font-body">
            {localGuests} Guest{localGuests !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLocalGuests(Math.max(1, localGuests - 1))}
              className="w-7 h-7 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-void transition-all duration-200 flex items-center justify-center text-sm font-bold"
            >−</button>
            <button
              type="button"
              onClick={() => setLocalGuests(Math.min(10, localGuests + 1))}
              className="w-7 h-7 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-void transition-all duration-200 flex items-center justify-center text-sm font-bold"
            >+</button>
          </div>
        </div>

        {/* ── Search button ── */}
        <div className={`px-5 py-4 flex items-center ${horizontal ? '' : 'mt-1'}`}>
          <button
            type="submit"
            className="btn-gold w-full !rounded-xl !px-8 !py-4 whitespace-nowrap"
          >
            Search Hotels
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
