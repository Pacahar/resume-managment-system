import axios from 'axios';
import router from '@/router/index.js';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для обработки ответов
api.interceptors.response.use(
  response => response,
  error => {
      if (error.response && error.response.status === 401) {
          console.error('Неавторизованный доступ. Перенаправление на страницу логина.');
          router.push('/login');
      }
      return Promise.reject(error);
  }
);

// Перехватчик для добавления токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
