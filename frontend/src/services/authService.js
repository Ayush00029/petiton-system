import API from './api';

export const loginUser = async (credentials) => {
  return await API.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
  return await API.post('/auth/register', userData);
};

export const verifyOtp = async (payload) => {
  const data = await API.post('/auth/verify-otp', payload);
  if (data.success && data.data?.token) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

export const resendOtp = async (email) => {
  return await API.post('/auth/resend-otp', { email });
};

export const getMe = async () => {
  return await API.get('/auth/me');
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
