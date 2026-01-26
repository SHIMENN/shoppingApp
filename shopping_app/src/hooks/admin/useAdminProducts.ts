import { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useToast } from '../useToast';
import api from '../../services/api';
import {type ProductFormData } from '../../types/admin';

export const useAdminProducts = () => {
  const { products, loading, loadProducts, deleteProduct } = useProductStore();
  const { toasts, showToast, removeToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image_url: product.image_url,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', image_url: '' });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image_url: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.product_id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!imageFile) {
          showToast('נא להעלות תמונה למוצר', 'warning');
          return;
        }
        await api.post('/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      await loadProducts();
      showToast(editingProduct ? ' עודכן בהצלחה! ✅' : ' נוסף בהצלחה! ✅', 'success');
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('שגיאה בשמירת המוצר', 'danger');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      try {
        await deleteProduct(id);
        showToast('המוצר נמחק', 'success');
      } catch (error) {
        showToast('שגיאה במחיקת המוצר', 'danger');
      }
    }
  };

  return {
    products, loading, toasts, removeToast, showModal, setShowModal,
    editingProduct, formData, setFormData, handleOpenModal, 
    handleSubmit, handleDelete, handleImageChange
  };
};