import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminReports } from '../../api/admin';
import { useRefresh } from '../../context/RefreshContext';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} bookings`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminReports = () => {
  const { refreshSignal } = useRefresh();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays]       = useState(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAdminReports(days);
        setData(res.data);
      } catch {
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [days, refreshSignal]);

  // Shorten date labels for the line chart
  const dailyChartData = (data?.daily || []).map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports</h1>
            <p className="text-gray-400 mt-1">Revenue analytics and booking trends</p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  days === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Daily Revenue Line Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-white font-bold text-lg mb-6">Daily Revenue (last {days} days)</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    interval={Math.floor(dailyChartData.length / 7)}
                    tickLine={false}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `$${v.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#3b82f6' }}
                    name="revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: '#8b5cf6' }}
                    name="bookings"
                    yAxisId={0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Bar Chart */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold text-lg mb-6">Monthly Revenue (last 6 months)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.monthly || []} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={v => `$${v.toLocaleString()}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Hotels */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold text-lg mb-4">Top Hotels by Revenue</h2>
                {(data?.top_hotels || []).length === 0 ? (
                  <div className="text-center text-gray-500 py-10">No data yet</div>
                ) : (
                  <div className="space-y-3">
                    {(data?.top_hotels || []).map((h, i) => {
                      const maxRevenue = data.top_hotels[0]?.revenue || 1;
                      const pct = Math.round((h.revenue / maxRevenue) * 100);
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white font-medium truncate max-w-[60%]">{h.hotel}</span>
                            <span className="text-blue-400 font-semibold">${h.revenue.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{h.bookings} bookings</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
