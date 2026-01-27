import api from "./api";

// משיכת ההזמנות עם תמיכה בעמודים (לפי דוח ינואר 2026)
export const getMyOrders = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
    
    // הנתונים כעת עטופים באובייקט שכולל data ומידע על עמודים
    return response.data; 
  } catch (error) {
    console.error("נכשלה משיכת ההזמנות:", error);
    throw error;
  }
};

// מחיקת הזמנה
export const deleteOrder = async (orderId: number) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};