import api from './axios';

// ── Dashboard ─────────────────────────────────────────────────────
export const getAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};

// ── Reports ───────────────────────────────────────────────────────
export const getAdminReports = async (days = 30) => {
  const { data } = await api.get('/admin/reports', { params: { days } });
  return data;
};

// ── Hotels ────────────────────────────────────────────────────────
export const getAdminHotels = async (params = {}) => {
  const { data } = await api.get('/admin/hotels', { params });
  return data;
};

export const toggleHotel = async (id) => {
  const { data } = await api.patch(`/admin/hotels/${id}/toggle`);
  return data;
};

export const createAdminHotel = async (payload) => {
  const { data } = await api.post('/hotels', payload); // Use public hotels POST (protected by AdminRoute)
  return data;
};

// ── Users ─────────────────────────────────────────────────────────
export const getAdminUsers = async (params = {}) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const updateAdminUser = async (id, payload) => {
  const { data } = await api.put(`/admin/users/${id}`, payload);
  return data;
};

export const toggleUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/toggle`);
  return data;
};

export const createAdminUser = async (payload) => {
  const { data } = await api.post('/admin/users', payload);
  return data;
};
