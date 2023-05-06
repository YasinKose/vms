import axiosInstance from '@/lib/service/service';

export const getProfileInformation = async () => {
  return await axiosInstance.get('/auth/me')
}