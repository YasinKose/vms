import axiosInstance from '@/lib/service/service';

export const getUserList = async () => {
  return await axiosInstance.get('/users');
}

export const getUserDetail = async (uuid) => {
  return await axiosInstance.get(`/users/${uuid}`);
}

export const addUser = async (formValues) => {
  return await axiosInstance.post('/users', formValues);
}

export const updateUser = async (uuid, formValues) => {
  return await axiosInstance.post(`/users/${uuid}`, formValues);
}