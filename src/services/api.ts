import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/token', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Authentication failed');
      } else if (error.request) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getPrograms = async () => {
  try {
    const response = await api.get('/programs');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(error.response?.data?.detail || 'Failed to fetch programs');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(error.response?.data?.detail || 'Failed to fetch metrics');
    }
    throw new Error('An unexpected error occurred');
  }
};

export default api;