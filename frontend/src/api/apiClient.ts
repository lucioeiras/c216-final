import axios from 'axios';

// A variável de ambiente VITE_API_URL foi definida no docker-compose.yml 
// e também pode ser definida num arquivo .env.local caso rode sem docker.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
