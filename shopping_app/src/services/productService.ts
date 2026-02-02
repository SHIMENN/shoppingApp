// קבלת מוצרים מהשרת - מעודכן לפי דוח ינואר 2026
import api from './api';

export const fetchProducts = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};