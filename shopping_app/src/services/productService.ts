// קבלת מוצרים מהשרת - מעודכן לפי דוח ינואר 2026
import api from './api';

export const fetchProducts = async (page = 1, limit = 20) => {
  try {
    // שליחת עמוד וגודל דף כפרמטרים ב-URL (Query Params)
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    
    // לפי המבנה החדש בשרת, הנתונים נמצאים ב-response.data
    // המבנה הוא: { data: [], total: X, totalPages: Y, page: Z }
    return response.data; 
  
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};