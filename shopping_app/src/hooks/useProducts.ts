import { useState, useEffect, useCallback, useRef } from 'react';
import { type Product } from '../types/product';
import { fetchProducts } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const pageRef = useRef<number>(1);
  const loadingRef = useRef<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts(1, 20);
        setProducts(response.data);
        setHasMore(response.page < response.totalPages);
      } catch {
        setError('שגיאה בטעינת המוצרים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const response = await fetchProducts(nextPage, 20);
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.product_id));
        const newProducts = response.data.filter((p: Product) => !existingIds.has(p.product_id));
        return [...prev, ...newProducts];
      });
      pageRef.current = nextPage;
      const moreAvailable = nextPage < response.totalPages;
      setHasMore(moreAvailable);
      if (!moreAvailable) setAllLoaded(true);
    } catch {
      setError('שגיאה בטעינת מוצרים נוספים');
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore]);

  // טוען את כל המוצרים הנותרים (לשימוש בעת סינון/חיפוש)
  const loadAll = useCallback(async () => {
    if (allLoaded || loadingRef.current) return;

    loadingRef.current = true;
    setLoadingMore(true);
    try {
      let currentPage = pageRef.current;
      let moreAvailable = hasMore;
      while (moreAvailable) {
        currentPage++;
        const response = await fetchProducts(currentPage, 20);
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.product_id));
          const newProducts = response.data.filter((p: Product) => !existingIds.has(p.product_id));
          return [...prev, ...newProducts];
        });
        moreAvailable = currentPage < response.totalPages;
      }
      pageRef.current = currentPage;
      setHasMore(false);
      setAllLoaded(true);
    } catch {
      setError('שגיאה בטעינת מוצרים נוספים');
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, allLoaded]);

  return { products, loading, loadingMore, error, hasMore, loadMore, loadAll, allLoaded };
};