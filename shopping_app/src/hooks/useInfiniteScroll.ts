import { useEffect } from 'react';

export const useInfiniteScroll = (
  loadMore: () => void,
  hasMore: boolean,
  loadingMore: boolean
) => {
  useEffect(() => {
    const handleScroll = () => {
      // אם כבר טוענים או שאין יותר מה לטעון - אל תעשה כלום
      if (loadingMore || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // בדיקה אם הגענו ל-300 פיקסלים מהסוף
      if (scrollTop + windowHeight >= documentHeight - 300) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore, loadingMore]);
};