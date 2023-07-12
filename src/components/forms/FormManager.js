import axiosInstance from '../../lib/service/service';

export const registerHandler = async (formValues) => {
  return await axiosInstance.post('/auth/register', formValues);
}

export const loginHandler = async (formValues) => {
  return await axiosInstance.post('/auth/login', formValues);
}

export const resetPasswordHandlerOne = async (formValues) => {
  return await axiosInstance.post('/auth/reset-password', formValues);
}

export const resetPasswordHandlerTwo = async (formValues) => {
  return await axiosInstance.post('/auth/reset-password-token', formValues);
}

export const checkAuth = async (token) => {
  return await axiosInstance.get(`/auth/verify-email/${token}`)
}