// ============================================
// Configuracion central de API (Axios)
// ============================================
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
});

// Interceptor: agregar token en cada peticion
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Devices
export const devicesService = {
  getAll: (filters = {}) => api.get('/devices', { params: filters }),
  getById: (id) => api.get(`/devices/${id}`),
  create: (data) => api.post('/devices', data),
  update: (id, data) => api.put(`/devices/${id}`, data),
  updateStatus: (id, status) => api.patch(`/devices/${id}/status`, { status }),
  remove: (id) => api.delete(`/devices/${id}`),
  getTypes: () => api.get('/devices/types'),
};

// Alerts
export const alertsService = {
  getAll: (filters = {}) => api.get('/alerts', { params: filters }),
  getActive: () => api.get('/alerts/active'),
  getStats: () => api.get('/alerts/stats'),
  create: (data) => api.post('/alerts', data),
  resolve: (id) => api.patch(`/alerts/${id}/resolve`),
  getSeverities: () => api.get('/alerts/severities'),
};

// Locations
export const locationsService = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
  getDevices: (id) => api.get(`/locations/${id}/devices`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  remove: (id) => api.delete(`/locations/${id}`),
};

// Metrics
export const metricsService = {
  getByDevice: (deviceId, params = {}) => api.get(`/metrics/device/${deviceId}`, { params }),
  getLatest: (deviceId) => api.get(`/metrics/device/${deviceId}/latest`),
  record: (data) => api.post('/metrics', data),
  getSummary: () => api.get('/metrics/summary'),
  getTypes: () => api.get('/metrics/types'),
};

// Users
export const usersService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/roles/all'),
};

export default api;
