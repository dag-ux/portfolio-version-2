import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = API_URL.replace(/\/api$/, '');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ==================== PROJECTS ====================
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch projects:', error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Make sure the backend is running.');
    }
    throw error;
  }
};

export const getProject = async (id: string) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch project ${id}:`, error.message);
    throw error;
  }
};

// ==================== SKILLS ====================
export const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch skills:', error.message);
    throw error;
  }
};

// ==================== EXPERIENCES ====================
export const getExperiences = async () => {
  try {
    const response = await api.get('/experiences');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch experiences:', error.message);
    throw error;
  }
};

// ==================== CONTACT ====================
export const sendMessage = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    const response = await api.post('/contact', data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to send message:', error.message);
    throw error;
  }
};