import axios from 'axios';

// En desarrollo usa el proxy de Vite '/api' o la variable de entorno
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores global
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
