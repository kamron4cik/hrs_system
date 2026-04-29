import api from './axios';

export const getReservations = async (page = 1) => {
  const { data } = await api.get('/reservations', { params: { page } });
  return data;
};

export const getReservation = async (id) => {
  const { data } = await api.get(`/reservations/${id}`);
  return data;
};

export const createReservation = async (reservationData) => {
  const { data } = await api.post('/reservations', reservationData);
  return data;
};

export const cancelReservation = async (id) => {
  const { data } = await api.put(`/reservations/${id}/cancel`);
  return data;
};

export const submitReview = async (hotelId, reviewData) => {
  const { data } = await api.post(`/hotels/${hotelId}/reviews`, reviewData);
  return data;
};

// Admin endpoints
export const getAdminReservations = async (params) => {
  const { data } = await api.get('/admin/reservations', { params });
  return data;
};

export const updateReservationStatus = async (id, status) => {
  const { data } = await api.put(`/admin/reservations/${id}`, { status });
  return data;
};
