import api from './api';

export const userService = {
  getAll: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/users/stats');
    return res.data;
  },
  getById: async (id: number | string) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  update: async (id: number | string, data: any) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
};
