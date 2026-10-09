// src/controllers/cartController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;

    const result = await pool.query(
      `SELECT c.*, p.title, p.price, p.image_url, p.stock_quantity
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    const items = result.rows;
    const total = items.reduce((sum: number, item: any) => sum + parseFloat(item.price) * item.quantity, 0);

    res.json({
      items,
      cart: items,
      total,
      count: items.length,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const productResult = await pool.query(
      'SELECT product_id, stock_quantity FROM products WHERE product_id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingResult = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    let result;
    if (existingResult.rows.length > 0) {
      // Update quantity
      result = await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, product_id]
      );
    } else {
      // Insert new item
      result = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, product_id, quantity]
      );
    }

    // Get updated cart
    const cartResult = await pool.query(
      `SELECT c.*, p.title, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.status(201).json({
      message: 'Item added to cart successfully',
      item: result.rows[0],
      cart: cartResult.rows,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { product_id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check stock
    const productResult = await pool.query(
      'SELECT stock_quantity FROM products WHERE product_id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productResult.rows[0].stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND (product_id = $3 OR cart_id = $3) RETURNING *',
      [quantity, userId, product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({
      message: 'Cart updated successfully',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { product_id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND (product_id = $2 OR cart_id = $2) RETURNING *',
      [userId, product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};