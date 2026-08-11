import API from './api';

export const loginUser = async (credentials) => {
  const data = await API.post('/auth/login', credentials);
  if (data.success && data.data?.token) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

export const registerUser = async (userData) => {
  const data = await API.post('/auth/register', userData);
  if (data.success && data.data?.token) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

export const getMe = async () => {
  return await API.get('/auth/me');
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

