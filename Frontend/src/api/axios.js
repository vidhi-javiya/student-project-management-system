import axios from 'axios';
import { getToken, logout } from '../utils/auth';

const api = axios.create({
  baseURL: 'https://localhost:7187/api'
});

// Request Interceptor: evry API request add Token 
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: 401 error  autometic LocalStorage Clear and Logout 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout(); // Delete the LocalStorage  move the  Login 
    }
    return Promise.reject(error);
  }
);

export default api;