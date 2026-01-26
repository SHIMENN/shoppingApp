import { useState, useMemo } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useToast } from '../hooks/useToast';
import type { Product } from '../types/product';

export const useHome = (products: Product[]) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toasts, showToast, removeToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [filterStock, setFilterStock] = useState<'all' | 'in-stock' | 'low-stock'>('all');

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
        const matchesStock = filterStock === 'all' ||
                            (filterStock === 'in-stock' && product.stock > 0) ||
                            (filterStock === 'low-stock' && product.stock > 0 && product.stock < 10);
        return matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'he');
        if (sortBy === 'price-asc') return a.price - b.price;
        return b.price - a.price;
      });
  }, [products, searchTerm, sortBy, filterStock]);

  return {
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    filterStock, setFilterStock,
    filteredProducts,
    handleAddToCart,
    toasts, removeToast
  };
};