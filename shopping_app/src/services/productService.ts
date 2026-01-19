// src/services/productService.ts
import api from './api';
import { type Product } from '../types/index';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};