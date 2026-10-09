import api from './api';

export const orderService = {
  create: async (orderData: {
    shipping_address: string;
    items: { product_id: number; quantity: number; price: number }[];
    payment_method?: string;
  }) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders');
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/orders');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/orders/stats');
    return res.data;
  },
  updateStatus: async (orderId: number, status: string) => {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data;
  }
};
