import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.captfx.com/',
  headers: {
    'Content-type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((request) => {
  const bearerToken = localStorage.getItem('access_token');
  if (bearerToken) {
    request.headers.Authorization = `Bearer ${bearerToken}`;
  }

  return request;
});

export default axiosInstance;