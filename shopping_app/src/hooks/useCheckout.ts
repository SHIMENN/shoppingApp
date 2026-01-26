import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import {type ShippingDetails } from '../types/cart';

export const useCheckout = () => {
  const navigate = useNavigate();
  const { checkout, loading, getTotalPrice, cart } = useCartStore();
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '', address: '', city: '', postalCode: '', phone: '', notes: ''
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 200 ? 0 : 25;
  const total = subtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError(null);
    try {
      await checkout(shippingDetails);
      navigate('/my-orders');
    } catch {
      setError('אירעה שגיאה בביצוע ההזמנה. אנא נסה שוב.');
    }
  };

  return {
    cart, loading, error, setError, validated, shippingDetails,
    subtotal, shippingCost, total,
    handleChange, handleSubmit, navigate
  };
};