// src/services/productService.ts
import api from './api';

export const fetchProducts = async ()=> {
  try{
    const response = await api.get('/products');
    console.log(response.data);
    if (response.data.products) return response.data.products;
    if (response.data.data) return response.data.data;
    return response.data;
  
  }catch (error){
  console.error("Error fetching products:", error);
  throw error;
}

};