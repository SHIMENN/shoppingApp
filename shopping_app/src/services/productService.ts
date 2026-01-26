// קבלת מוצרים מהשרת
import api from './api';

export const fetchProducts = async ()=> {
  try{
    const response = await api.get('/products');
    if (response.data.products) return response.data.products;
    if (response.data.data) return response.data.data;
    return response.data;
  
  }catch (error){
  console.error("Error fetching products:", error);
  throw error;
}

};