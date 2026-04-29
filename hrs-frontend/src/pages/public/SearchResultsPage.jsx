import React, { useState, useEffect } from 'react';
import HotelListingMap from '../../components/ui/HotelListingMap';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../context/SearchContext';
import { getHotels } from '../../api/hotels';
import { format } from 'date-fns';
import SearchBar from '../../components/shared/SearchBar';
import HotelCard from '../../components/shared/HotelCard';

const SearchResultsPage = () => {
  const { searchParams } = useSearch();
  const { t } = useTranslation();
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'recommended',
    stars: [],
    min_price: '',
    max_price: '',
  });

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {
        city:      searchParams.city,
        check_in:  searchParams.checkIn  ? format(searchParams.checkIn,  'yyyy-MM-dd') : null,
        check_out: searchParams.checkOut ? format(searchParams.checkOut, 'yyyy-MM-dd') : null,
        guests:    searchParams.guests,
        sort:      filters.sort,
        stars:     filters.stars.join(','),
        min_price: filters.min_price,
        max_price: filters.max_price,
      };
      const res = await getHotels(params);
      setHotels(res.data);
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, [searchParams, filters]);

  const toggleStar = (star) =>
    setFilters(prev => ({
      ...prev,
      stars: prev.stars.includes(star) ? prev.stars.filter(s => s !== star) : [...prev.stars, star],
    }));

  const inputCls =
    'w-full bg-void/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-alabaster/70 placeholder:text-alabaster/25 focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="min-h-screen bg-void text-alabaster">
      {/* Search bar band */}
      <div className="pt-28 pb-8 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <SearchBar horizontal={true} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="glass rounded-2xl p-6 sticky top-28 space-y-8">
            <div>
              <p className="section-label mb-5">{t('search.filter_by')}</p>

              {/* Stars */}
              <h4 className="font-body text-xs text-alabaster/50 uppercase tracking-wider mb-3">
                {t('search.star_rating')}
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleStar(star)}
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer
                        ${filters.stars.includes(star)
                          ? 'bg-gold border-gold'
                          : 'border-white/20 group-hover:border-gold/50'}`}
                    >
                      {filters.stars.includes(star) && (
                        <svg className="w-2.5 h-2.5 text-void" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-alabaster/50 group-hover:text-gold transition-colors">
                      {'★'.repeat(star)} {star === 5 ? 'Luxury' : star === 4 ? 'Premium' : star === 3 ? 'Comfort' : star === 2 ? 'Standard' : 'Budget'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h4 className="font-body text-xs text-alabaster/50 uppercase tracking-wider mb-3">
                {t('search.price_range')}
              </h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t('search.min')}
                  value={filters.min_price}
                  onChange={e => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
                  className={inputCls}
                />
                <input
                  type="number"
                  placeholder={t('search.max')}
                  value={filters.max_price}
                  onChange={e => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Map toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`w-full py-3 rounded-xl text-xs font-body font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                showMap
                  ? 'bg-gold/10 text-gold border border-gold/30'
                  : 'btn-ghost'
              }`}
            >
              <span>🗺️</span> {showMap ? t('search.show_list') : t('search.show_map')}
            </button>
          </div>
        </aside>

        {/* ── Results ── */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/5">
            <div>
              <h1 className="font-display text-alabaster text-2xl md:text-3xl">
                {searchParams.city
                  ? <><span className="text-gold">{searchParams.city}</span>: Hotels</>
                  : 'All Hotels'
                }
              </h1>
              <p className="font-body text-alabaster/30 text-xs mt-1">
                {hotels.length} {t('search.properties_found')}
              </p>
            </div>
            <div className="flex items-center glass rounded-xl overflow-hidden">
              <span className="px-3 py-2.5 text-[10px] uppercase tracking-wider text-alabaster/40 border-r border-white/5">
                {t('search.sort')}
              </span>
              <select
                className="bg-transparent px-3 py-2.5 text-xs text-gold focus:outline-none cursor-pointer font-body"
                value={filters.sort}
                onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="recommended">{t('search.sort_recommended')}</option>
                <option value="price_asc">{t('search.sort_price_asc')}</option>
                <option value="price_desc">{t('search.sort_price_desc')}</option>
                <option value="rating">{t('search.sort_rating')}</option>
              </select>
            </div>
          </div>

          {/* Map view */}
          {showMap ? (
            <div className="animate-fadeIn space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-alabaster text-xl">{t('search.map_view')}</h2>
                <button onClick={() => setShowMap(false)} className="text-xs text-gold hover:text-alabaster transition-colors">
                  {t('search.close_map')}
                </button>
              </div>
              <div className="hrs-card overflow-hidden rounded-2xl">
                <HotelListingMap hotels={hotels} />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-64 rounded-2xl" />
                ))
              ) : hotels.length === 0 ? (
                <div className="hrs-card p-16 text-center">
                  <p className="font-display text-alabaster/30 text-3xl mb-3">No properties found</p>
                  <p className="font-body text-alabaster/20 text-sm">{t('search.try_adjusting')}</p>
                </div>
              ) : (
                hotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
