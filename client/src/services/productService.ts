import api from './api';

export const productService = {
  getAll: async (params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id: number | string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  getFeatured: async () => {
    const res = await api.get('/products/featured');
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/products', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  }
};
