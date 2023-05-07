import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

const axiosInstanceFileUpload = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-type': 'multipart/form-data',
  }
});

axiosInstance.interceptors.request.use((request) => {
  const bearerToken = localStorage.getItem('access_token');
  if (bearerToken) {
    request.headers.Authorization = `Bearer ${bearerToken}`;
  }

  return request;
});

axiosInstanceFileUpload.interceptors.request.use((request) => {
  const bearerToken = localStorage.getItem('access_token');
  if (bearerToken) {
    request.headers.Authorization = `Bearer ${bearerToken}`;
  }

  return request;
});

export default axiosInstance;
export {axiosInstanceFileUpload};