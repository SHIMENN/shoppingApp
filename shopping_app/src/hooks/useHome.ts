import { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useToast } from '../hooks/useToast';
import type { Product } from '../types/product';

export const useHome = (products: Product[], loadAll?: () => void) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toasts, showToast, removeToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'price-asc' | 'price-desc'>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceInited, setPriceInited] = useState(false);

  // חישוב טווח המחירים מכל המוצרים
  const maxPrice = useMemo(() => {
    if (!products.length) return 0;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  // אתחול טווח המחירים פעם אחת כשהמוצרים נטענים
  useEffect(() => {
    if (maxPrice > 0 && !priceInited) {
      setPriceRange([0, maxPrice]);
      setPriceInited(true);
    }
  }, [maxPrice, priceInited]);

  const isPriceFiltered = priceInited && (priceRange[0] > 0 || priceRange[1] < maxPrice);

  // כשיש חיפוש או סינון פעיל - טוען את כל המוצרים
  useEffect(() => {
    if ((searchTerm || isPriceFiltered) && loadAll) {
      loadAll();
    }
  }, [searchTerm, isPriceFiltered, loadAll]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
      showToast(`${product.name} נוסף לעגלה בהצלחה! `, 'success');
    } catch (error) {
      showToast('שגיאה בהוספת המוצר ', 'danger');
    }
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'default') return 0;
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'he');
        if (sortBy === 'price-asc') return a.price - b.price;
        return b.price - a.price;
      });
  }, [products, searchTerm, sortBy, priceRange]);

  return {
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    priceRange, setPriceRange,
    maxPrice, isPriceFiltered,
    filteredProducts,
    handleAddToCart,
    toasts, removeToast
  };
};
