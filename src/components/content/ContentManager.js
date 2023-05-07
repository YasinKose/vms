import axiosInstance from '@/lib/service/service';

export const getUserList = async () => {
  return await axiosInstance.get('/users');
}

export const createUser = async (formValues) => {
  return await axiosInstance.post('/users', formValues);
}

export const updateUser = async (uuid, formValues) => {
  return await axiosInstance.put(`/users/${uuid}`, formValues);
}