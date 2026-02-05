import api from './api';
import { type User } from '../types/user';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: number, data: {
  user_name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'user' | 'admin';
}): Promise<User> => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const getAllUsersWithDeleted = async (): Promise<User[]> => {
  const response = await api.get('/users/with-deleted');
  return response.data;
};

export const restoreUser = async (userId: number): Promise<User> => {
  const response = await api.patch(`/users/${userId}/restore`);
  return response.data;
};
