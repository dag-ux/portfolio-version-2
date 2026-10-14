import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'adminToken';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const adminApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const loginAdmin = async (email: string, password: string) => {
  const res = await adminApi.post('/auth/login', { email, password });
  return res.data as { token: string; email: string };
};

export const verifyAdmin = async () => {
  const res = await adminApi.get('/auth/verify');
  return res.data as { valid: boolean; email: string };
};

export const getUnreadCount = async () => {
  const res = await adminApi.get('/messages/unread-count');
  return res.data as { count: number };
};

export const getMessages = async () => {
  const res = await adminApi.get('/messages');
  return res.data;
};

export const markMessageRead = async (id: string) => {
  const res = await adminApi.patch(`/messages/${id}/read`);
  return res.data;
};

export const deleteMessage = async (id: string) => {
  const res = await adminApi.delete(`/messages/${id}`);
  return res.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await adminApi.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as { url: string; publicId: string; width: number; height: number };
};

export const getAdminProjects = async () => {
  const res = await adminApi.get('/projects');
  return res.data;
};

export const createProject = async (data: any) => {
  const res = await adminApi.post('/projects', data);
  return res.data;
};

export const updateProject = async (id: string, data: any) => {
  const res = await adminApi.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await adminApi.delete(`/projects/${id}`);
  return res.data;
};