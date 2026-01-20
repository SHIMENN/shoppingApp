import { useState, useEffect } from 'react';
import { type Product } from '../types/product';
import { fetchProducts } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('שגיאה בטעינת המוצרים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return { products, loading, error };
};