import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for file uploads
export const uploadApi = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default api;