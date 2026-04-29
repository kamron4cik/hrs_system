import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin',         label: 'Dashboard',  icon: '📊', end: true },
  { to: '/admin/hotels',  label: 'Hotels',     icon: '🏨' },
  { to: '/admin/users',   label: 'Users',      icon: '👥' },
  { to: '/admin/reports', label: 'Reports',    icon: '📈' },
];

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              HRS
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
              <p className="text-gray-400 text-xs truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-gray-800 pt-4 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <span>←</span> Back to Site
          </button>
          <div className="px-4 pt-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full
              ${user?.role === 'super_admin' ? 'bg-purple-900/60 text-purple-300' : 'bg-blue-900/60 text-blue-300'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {user?.role === 'super_admin' ? 'Super Admin' : 'Hotel Admin'}
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────── */}
      <main className="ml-64 flex-1 min-h-screen bg-gray-950 text-white overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
