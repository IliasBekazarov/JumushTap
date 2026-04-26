import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing on a real device
export const BASE_URL = 'http://192.168.0.132:8000'; // Real device (same WiFi)

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post('/users/register/', data);
export const loginUser = (data) => api.post('/users/login/', data);
export const getProfile = () => api.get('/users/profile/');
export const updateProfile = (data) => api.patch('/users/profile/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Jobs
export const getJobs = (params) => api.get('/jobs/', { params });
export const getJob = (id) => api.get(`/jobs/${id}/`);
export const createJob = (data) => api.post('/jobs/', data);
export const deleteJob = (id) => api.delete(`/jobs/${id}/`);
export const toggleBookmark = (id) => api.post(`/jobs/${id}/bookmark/`);
export const rateJob = (id, score) => api.post(`/jobs/${id}/rate/`, { score });
export const getMyJobs = () => api.get('/jobs/my/');
export const getMyBookmarks = () => api.get('/jobs/bookmarks/');

export default api;
