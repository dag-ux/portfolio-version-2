import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔍 API URL:', API_URL);

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
    console.log('📤 Fetching projects from:', `${API_URL}/projects`);
    const response = await api.get('/projects');
    console.log('✅ Projects fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch projects:', error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:5000');
    }
    throw error;
  }
};

export const getProject = async (id: string) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed to fetch project ${id}:`, error.message);
    throw error;
  }
};

export const createProject = async (data: any) => {
  try {
    const response = await api.post('/projects', data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to create project:', error.message);
    throw error;
  }
};

export const updateProject = async (id: string, data: any) => {
  try {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed to update project ${id}:`, error.message);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed to delete project ${id}:`, error.message);
    throw error;
  }
};

// ==================== SKILLS ====================
export const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch skills:', error.message);
    throw error;
  }
};

export const createSkill = async (data: any) => {
  try {
    const response = await api.post('/skills', data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to create skill:', error.message);
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
    console.error('❌ Failed to send message:', error.message);
    throw error;
  }
};

// ==================== EXPERIENCE ====================
export const getExperiences = async () => {
  try {
    const response = await api.get('/experiences');
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch experiences:', error.message);
    throw error;
  }
};

export const createExperience = async (data: any) => {
  try {
    const response = await api.post('/experiences', data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to create experience:', error.message);
    throw error;
  }
};