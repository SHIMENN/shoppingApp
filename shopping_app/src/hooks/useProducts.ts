import { useState, useEffect, useCallback } from 'react';
import { type Product } from '../types/product';
import { fetchProducts } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts(1, 20);
        setProducts(response.data);
        setHasMore(response.page < response.totalPages);
      } catch (err) {
        setError('שגיאה בטעינת המוצרים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetchProducts(nextPage, 20);
      setProducts(prev => [...prev, ...response.data]);
      setPage(nextPage);
      setHasMore(nextPage < response.totalPages);
    } catch (err) {
      setError('שגיאה בטעינת מוצרים נוספים');
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore]);

  return { products, loading, loadingMore, error, hasMore, loadMore };
};