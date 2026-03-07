import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth APIs
export const authAPI = {
    login: (username, password) =>
        api.post('/auth/login', { username, password }),

    logout: () =>
        api.post('/auth/logout'),

    getCurrentUser: () =>
        api.get('/auth/me'),
};

// Admin APIs
export const adminAPI = {
    registerUser: (userData) =>
        api.post('/admin/users', userData),

    getUsers: (role) =>
        api.get('/admin/users', { params: { role } }),

    createMapping: (facultyId, studentIds) =>
        api.post('/admin/mappings', { facultyId, studentIds }),

    getMappings: () =>
        api.get('/admin/mappings'),

    getAnalytics: () =>
        api.get('/admin/analytics'),

    getRankings: () =>
        api.get('/admin/rankings'),
};

// Faculty APIs
export const facultyAPI = {
    getStudents: () =>
        api.get('/faculty/students'),

    uploadMarks: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/faculty/upload/marks', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    uploadPSkills: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/faculty/upload/pskills', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    uploadPoints: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/faculty/upload/points', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getStudentAnalytics: (studentId) =>
        api.get(`/faculty/analytics/${studentId}`),

    getRankings: () =>
        api.get('/faculty/rankings'),
};

// Student APIs
export const studentAPI = {
    getProfile: () =>
        api.get('/student/profile'),

    getMarks: () =>
        api.get('/student/marks'),

    getPSkills: () =>
        api.get('/student/pskills'),

    getPoints: () =>
        api.get('/student/points'),

    getRank: () =>
        api.get('/student/rank'),

    connectProfiles: (github, leetcode) =>
        api.post('/student/profiles', { github, leetcode }),

    getProfiles: () =>
        api.get('/student/profiles'),

    getAnalytics: () =>
        api.get('/student/analytics'),

    getLeaderboard: () =>
        api.get('/student/leaderboard'),
};

// Error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login on unauthorized
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
