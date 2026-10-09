// src/routes/cartRoutes.ts
import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:product_id', updateCartItem);
router.delete('/:product_id', removeFromCart);
router.delete('/', clearCart);

export default router;