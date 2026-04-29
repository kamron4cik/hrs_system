import api from './axios';

export const getHotels = async (params) => {
  const { data } = await api.get('/hotels', { params });
  return data;
};

export const getHotel = async (id) => {
  const { data } = await api.get(`/hotels/${id}`);
  return data;
};

export const getHotelRooms = async (id, params) => {
  const { data } = await api.get(`/hotels/${id}/rooms`, { params });
  return data;
};

export const checkRoomAvailability = async (roomId, params) => {
  const { data } = await api.get(`/rooms/${roomId}/availability`, { params });
  return data;
};

export const getHotelReviews = async (id, page = 1) => {
  const { data } = await api.get(`/hotels/${id}/reviews`, { params: { page } });
  return data;
};

// Admin endpoints
export const createHotel = async (hotelData) => {
  const { data } = await api.post('/admin/hotels', hotelData);
  return data;
};

export const updateHotel = async (id, hotelData) => {
  const { data } = await api.put(`/admin/hotels/${id}`, hotelData);
  return data;
};

export const deleteHotel = async (id) => {
  const { data } = await api.delete(`/admin/hotels/${id}`);
  return data;
};
