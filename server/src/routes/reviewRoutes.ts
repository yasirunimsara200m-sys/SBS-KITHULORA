// src/routes/reviewRoutes.ts
import { Router } from 'express';
import { 
  getProductReviews, 
  createReview, 
  getAllReviews, 
  deleteReview 
} from '../controllers/reviewController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public: Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Customer: Submit a review for a product (Auth required)
router.post('/product/:productId', authMiddleware, createReview);

// Admin: Get all reviews
router.get('/admin/all', authMiddleware, adminMiddleware, getAllReviews);

// Auth (Admin or owner): Delete review
router.delete('/:id', authMiddleware, deleteReview);

export default router;
