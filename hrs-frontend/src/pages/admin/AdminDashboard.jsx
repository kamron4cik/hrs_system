import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminDashboard } from '../../api/admin';
import { getAdminReservations, updateReservationStatus } from '../../api/reservations';
import { useRefresh } from '../../context/RefreshContext';
import { formatPrice, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: 'bg-green-900/60 text-green-300',
    cancelled: 'bg-red-900/60 text-red-300',
    completed: 'bg-blue-900/60 text-blue-300',
    pending:   'bg-yellow-900/60 text-yellow-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${styles[status] || 'bg-gray-800 text-gray-400'}`}>
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const { refreshSignal, triggerRefresh } = useRefresh();
  const { t } = useTranslation();
  const [stats, setStats]               = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [dashRes, resRes] = await Promise.all([
        getAdminDashboard(),
        getAdminReservations({ per_page: 8 }),
      ]);
      setStats(dashRes.data);
      setReservations(resRes.data || []);
    } catch {
      toast.error('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshSignal]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      toast.success('Status updated!');
      triggerRefresh();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </AdminLayout>
  );

  const { revenue, hotels, users, reservations: resCounts } = stats || {};

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t('admin.dashboard')}</h1>
          <p className="text-gray-400 mt-1">Platform overview and real-time stats</p>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard icon="💰" label={t('admin.totalRevenue')}   value={formatPrice(revenue?.total   || 0)} color="bg-green-900/40"  />
          <StatCard icon="📅" label={t('admin.today')}           value={formatPrice(revenue?.daily   || 0)} sub="vs yesterday" color="bg-blue-900/40"  />
          <StatCard icon="📆" label={t('admin.thisWeek')}       value={formatPrice(revenue?.weekly  || 0)} color="bg-purple-900/40" />
          <StatCard icon="🗓" label={t('admin.thisMonth')}      value={formatPrice(revenue?.monthly || 0)} color="bg-orange-900/40" />
        </div>

        {/* Entity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Hotels */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{t('admin.hotels')}</h3>
              <button onClick={() => navigate('/admin/hotels')} className="text-xs text-blue-400 hover:text-blue-300">{t('admin.viewAll')} →</button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-green-900/30 rounded-lg p-3 text-center">
                <p className="text-green-400 text-2xl font-bold">{hotels?.active ?? 0}</p>
                <p className="text-gray-400 text-xs mt-1">{t('admin.active')}</p>
              </div>
              <div className="flex-1 bg-red-900/30 rounded-lg p-3 text-center">
                <p className="text-red-400 text-2xl font-bold">{hotels?.inactive ?? 0}</p>
                <p className="text-gray-400 text-xs mt-1">{t('admin.inactive')}</p>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-white text-2xl font-bold">{hotels?.total ?? 0}</p>
                <p className="text-gray-400 text-xs mt-1">{t('admin.total')}</p>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{t('admin.users')}</h3>
              <button onClick={() => navigate('/admin/users')} className="text-xs text-blue-400 hover:text-blue-300">{t('admin.viewAll')} →</button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-green-900/30 rounded-lg p-3 text-center">
                <p className="text-green-400 text-2xl font-bold">{users?.active ?? 0}</p>
                <p className="text-gray-400 text-xs mt-1">{t('admin.active')}</p>
              </div>
              <div className="flex-1 bg-red-900/30 rounded-lg p-3 text-center">
                <p className="text-red-400 text-2xl font-bold">{users?.inactive ?? 0}</p>
                <p className="text-gray-400 text-xs mt-1">{t('admin.inactive')}</p>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-white text-2xl font-bold">{users?.total ?? 0}</p>
                <p className="text-gray-400 text-xs mt-1">{t('admin.total')}</p>
              </div>
            </div>
          </div>

          {/* Reservations */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{t('admin.recentReservations')}</h3>
              <span className="text-xs text-gray-400">{resCounts?.total ?? 0} {t('admin.total')}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: t('admin.confirmed'), key: 'confirmed', color: 'bg-green-500' },
                { label: t('admin.pending'),   key: 'pending',   color: 'bg-yellow-500' },
                { label: t('admin.completed'), key: 'completed', color: 'bg-blue-500' },
                { label: t('admin.cancelled'), key: 'cancelled', color: 'bg-red-500' },
              ].map(({ label, key, color }) => {
                const count = resCounts?.[key] ?? 0;
                const total = resCounts?.total || 1;
                const pct   = Math.round((count / total) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Reservations Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">{t('admin.recentReservations')}</h2>
            <button onClick={() => navigate('/admin/reports')} className="text-xs text-blue-400 hover:text-blue-300">{t('admin.viewReports')} →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Code</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">{t('admin.guest')}</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">{t('admin.hotels')}</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">{t('admin.dates')}</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">{t('admin.total')}</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Status</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-300">{res.confirmation_code}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{res.user?.first_name} {res.user?.last_name}</p>
                      <p className="text-xs text-gray-500">{res.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{res.room?.hotel?.name || '—'}</p>
                      <p className="text-xs text-gray-500 capitalize">{res.room?.room_type} room</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <p>{formatDate(res.check_in_date)}</p>
                      <p>→ {formatDate(res.check_out_date)}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">{formatPrice(res.total_price)}</td>
                    <td className="px-6 py-4"><StatusBadge status={res.status} /></td>
                    <td className="px-6 py-4">
                      <select
                        className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        value={res.status}
                        onChange={e => handleStatusChange(res.id, e.target.value)}
                      >
                        <option value="pending">{t('admin.pending')}</option>
                        <option value="confirmed">{t('admin.confirmed')}</option>
                        <option value="completed">{t('admin.completed')}</option>
                        <option value="cancelled">{t('admin.cancelled')}</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">{t('admin.noResults')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
