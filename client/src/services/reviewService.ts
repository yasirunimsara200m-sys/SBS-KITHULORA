import api from './api';

export interface Review {
  review_id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  product_title?: string;
  product_image?: string;
}

export const reviewService = {
  getByProduct: async (productId: string | number) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },
  create: async (productId: string | number, data: { rating: number; comment: string }) => {
    const res = await api.post(`/reviews/product/${productId}`, data);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/reviews/admin/all');
    return res.data;
  },
  delete: async (reviewId: number) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data;
  }
};
