import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// Store for getting the token - will be set from ClerkTokenProvider
let getToken = null;

export const setClerkTokenGetter = (tokenGetter) => {
    getToken = tokenGetter;
};

// Request interceptor to add Clerk token
api.interceptors.request.use(async (config) => {
    if (getToken) {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting Clerk token:', error);
        }
    }

    // Don't override Content-Type if it's already set (e.g., for multipart/form-data)
    // The browser will set the correct boundary for FormData automatically
    if (config.headers['Content-Type'] === 'multipart/form-data') {
        delete config.headers['Content-Type'];
    }

    return config;
}, (error) => Promise.reject(error));

// Response interceptor for errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clerk will handle the redirect via ClerkProvider
            console.log('Unauthorized - session may have expired');
        }
        return Promise.reject(error);
    }
);

export default api;
