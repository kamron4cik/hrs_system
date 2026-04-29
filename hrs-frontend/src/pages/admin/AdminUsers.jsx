import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminUsers, updateAdminUser, toggleUser } from '../../api/admin';
import { useRefresh } from '../../context/RefreshContext';
import toast from 'react-hot-toast';

const RoleBadge = ({ role }) => {
  const styles = {
    super_admin: 'bg-purple-900/60 text-purple-300 border-purple-800',
    hotel_admin: 'bg-blue-900/60 text-blue-300 border-blue-800',
    guest:       'bg-gray-800 text-gray-300 border-gray-700',
  };
  const labels = { super_admin: 'Super Admin', hotel_admin: 'Hotel Admin', guest: 'Guest' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[role] || styles.guest}`}>
      {labels[role] || role}
    </span>
  );
};

const AdminUsers = () => {
  const { refreshSignal, triggerRefresh } = useRefresh();
  const [users, setUsers]       = useState([]);
  const [meta, setMeta]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState('all');
  const [filter, setFilter]     = useState('all');
  const [page, setPage]         = useState(1);
  const [editing, setEditing]   = useState(null); // user id being edited
  const [toggling, setToggling] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating]   = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    try {
      await createAdminUser(payload);
      toast.success('User created successfully!');
      setShowModal(false);
      triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, search: search || undefined };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (filter !== 'all') params.is_active = filter === 'active';
      const res = await getAdminUsers(params);
      setUsers(res.data || []);
      setMeta(res.meta);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, filter, refreshSignal]);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async (user, newRole) => {
    setEditing(user.id);
    try {
      await updateAdminUser(user.id, { role: newRole });
      toast.success('Role updated!');
      triggerRefresh();
    } catch {
      toast.error('Failed to update role.');
    } finally {
      setEditing(null);
    }
  };

  const handleToggle = async (user) => {
    setToggling(user.id);
    try {
      const res = await toggleUser(user.id);
      toast.success(res.message);
      triggerRefresh();
    } catch {
      toast.error('Failed to toggle user.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-gray-400 mt-1">Manage user accounts and roles</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <span>+</span> Create New User
          </button>
        </div>

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-900 border border-neutral dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-text-primary dark:text-white mb-4">{t('admin.createNewUser')}</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.firstName')}</label>
                    <input name="first_name" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.lastName')}</label>
                    <input name="last_name" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.email')}</label>
                  <input name="email" type="email" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.password')}</label>
                  <input name="password" type="password" required className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('admin.role')}</label>
                  <select name="role" defaultValue="guest" className="w-full bg-gray-50 dark:bg-gray-800 border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500">
                    <option value="guest">Guest</option>
                    <option value="hotel_admin">Hotel Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:text-text-primary dark:hover:text-white transition">{t('common.cancel')}</button>
                  <button type="submit" disabled={creating} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50">
                    {creating ? t('admin.creating') : t('common.confirm')}
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
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <select
            value={roleFilter}
            onChange={e => { setRole(e.target.value); setPage(1); }}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="hotel_admin">Hotel Admin</option>
            <option value="guest">Guest</option>
          </select>
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
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">User</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Role</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Phone</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Status</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Joined</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Change Role</th>
                  <th className="px-6 py-3 text-gray-400 font-medium text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No users found.</td></tr>
                ) : users.map(user => (
                  <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.full_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{user.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.is_active
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user, e.target.value)}
                        disabled={editing === user.id}
                        className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="guest">Guest</option>
                        <option value="hotel_admin">Hotel Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={toggling === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          user.is_active
                            ? 'bg-red-900/40 text-red-300 hover:bg-red-900/70 border border-red-800'
                            : 'bg-green-900/40 text-green-300 hover:bg-green-900/70 border border-green-800'
                        } disabled:opacity-50`}
                      >
                        {toggling === user.id ? '...' : user.is_active ? 'Deactivate' : 'Activate'}
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
                Page {meta.current_page} of {meta.last_page} — {meta.total} users
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-40">← Prev</button>
                <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
