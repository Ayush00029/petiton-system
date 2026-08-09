import API from './api';

export const suggestCategory = async (description) => {
  return await API.post('/ai/suggest-category', { description });
};
