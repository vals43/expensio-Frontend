// src/api/apiClient.js
import axios from 'axios';
import { getToken } from '../services/authService';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const apiClient = axios.create({
    baseURL: BACKEND_URL, // URL de votre API
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de requêtes pour ajouter le token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur de réponses pour gérer les erreurs 401/403
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Gérer le cas où le token est expiré ou invalide
        if (error.response.status === 401 || error.response.status === 403) {
            console.error('Token invalide ou expiré. Redirection vers la page de connexion.');
            // Vous pouvez rediriger l'utilisateur vers la page de connexion
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;