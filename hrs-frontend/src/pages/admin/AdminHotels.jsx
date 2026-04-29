import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminHotels, toggleHotel } from '../../api/admin';
import { useRefresh } from '../../context/RefreshContext';
import toast from 'react-hot-toast';

const StarRating = ({ count }) => (
  <span className="text-yellow-400 text-xs">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>
);

const AdminHotels = () => {
  const { refreshSignal, triggerRefresh } = useRefresh();
  const [hotels, setHotels]     = useState([]);
  const [meta, setMeta]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all'); // all | active | inactive
  const [page, setPage]         = useState(1);
  const [toggling, setToggling] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating]   = useState(false);

  const UZ_CITIES = ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva', 'Andijan', 'Fergana', 'Namangan', 'Nukus', 'Qarshi', 'Termez', 'Urgench', 'Kokand'];

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Construct multilingual description JSON
    const payload = {
      ...data,
      description: JSON.stringify({
        en: data.desc_en,
        uz: data.desc_uz,
        ru: data.desc_ru,
      }),
      country: 'Uzbekistan',
      amenities: ['wifi', 'parking', 'gym'], // Default amenities for now
      star_rating: parseInt(data.star_rating)
    };

    try {
      await createAdminHotel(payload);
      toast.success('Hotel created successfully!');
      setShowModal(false);
      triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create hotel. Verify Uzbekistan coordinates.');
    } finally {
      setCreating(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, search: search || undefined };
      if (filter !== 'all') params.is_active = filter === 'active';
      const res = await getAdminHotels(params);
      setHotels(res.data || []);
      setMeta(res.meta);
    } catch {
      toast.error('Failed to load hotels.');
    } finally {
      setLoading(false);
    }
  }, [page, search, filter, refreshSignal]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (hotel) => {
    setToggling(hotel.id);
    try {
      const res = await toggleHotel(hotel.id);
      toast.success(res.message);
      triggerRefresh();
    } catch {
      toast.error('Failed to toggle hotel status.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Hotels</h1>
            <p className="text-gray-400 mt-1">Manage all hotels on the platform</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <span>+</span> Add New Hotel
          </button>
        </div>

        {/* Create Hotel Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-900 border border-neutral dark:border-gray-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
              <h2 className="text-xl font-bold text-text-primary dark:text-white mb-6">{t('admin.registerNewHotel')}</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.hotelName')}</label>
                    <input name="name" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.city')}</label>
                    <select name="city" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500">
                      {UZ_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.address')}</label>
                    <input name="address" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.starRating')}</label>
                    <select name="star_rating" className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500">
                      {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} {t('search.stars')}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.latitude')}</label>
                    <input name="latitude" type="number" step="any" placeholder="e.g. 41.3" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.longitude')}</label>
                    <input name="longitude" type="number" step="any" placeholder="e.g. 69.2" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('admin.descriptions')}</label>
                  <textarea name="desc_en" placeholder="Description (English)" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500 h-20" />
                  <textarea name="desc_uz" placeholder="Description (Uzbek)" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500 h-20" />
                  <textarea name="desc_ru" placeholder="Description (Russian)" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500 h-20" />
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:text-text-primary dark:hover:text-white transition">{t('common.cancel')}</button>
                  <button type="submit" disabled={creating} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50">
                    {creating ? t('admin.creating') : t('admin.register')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Hotel</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Owner</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Stars</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Rooms</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Reviews</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Status</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td></tr>
                ) : hotels.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No hotels found.</td></tr>
                ) : hotels.map(hotel => (
                  <tr key={hotel.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{hotel.name}</p>
                      <p className="text-xs text-gray-500">{hotel.city}, {hotel.country}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{hotel.owner?.name || '—'}</p>
                      <p className="text-xs text-gray-500">{hotel.owner?.email}</p>
                    </td>
                    <td className="px-6 py-4"><StarRating count={hotel.star_rating} /></td>
                    <td className="px-6 py-4 text-gray-300">{hotel.rooms_count}</td>
                    <td className="px-6 py-4 text-gray-300">{hotel.reviews_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        hotel.is_active
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hotel.is_active ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                        {hotel.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(hotel)}
                        disabled={toggling === hotel.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          hotel.is_active
                            ? 'bg-red-900/40 text-red-300 hover:bg-red-900/70 border border-red-800'
                            : 'bg-green-900/40 text-green-300 hover:bg-green-900/70 border border-green-800'
                        } disabled:opacity-50`}
                      >
                        {toggling === hotel.id ? '...' : hotel.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page {meta.current_page} of {meta.last_page} — {meta.total} hotels
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-40"
                >← Prev</button>
                <button
                  onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={page === meta.last_page}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-40"
                >Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHotels;
