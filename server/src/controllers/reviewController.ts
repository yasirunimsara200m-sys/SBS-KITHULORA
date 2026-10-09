// src/controllers/reviewController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `SELECT r.review_id, r.user_id, r.product_id, r.rating, r.comment, r.created_at,
              u.name as user_name, u.email as user_email
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json({ reviews: result.rows });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ message: 'Server error loading reviews' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.user_id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await client.query('BEGIN');

    // Insert review
    const insertRes = await client.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, productId, rating, comment || '']
    );

    const newReview = insertRes.rows[0];

    // Recalculate average rating and count for this product
    const statsRes = await client.query(
      `SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*)::int as rev_count
       FROM reviews
       WHERE product_id = $1`,
      [productId]
    );

    const avgRating = statsRes.rows[0]?.avg_rating || rating;
    const revCount = statsRes.rows[0]?.rev_count || 1;

    // Update product table
    await client.query(
      `UPDATE products 
       SET rating = $1, reviews = $2
       WHERE product_id = $3`,
      [avgRating, revCount, productId]
    );

    await client.query('COMMIT');

    // Get author's name
    const userRes = await pool.query('SELECT name, email FROM users WHERE user_id = $1', [userId]);
    const author = userRes.rows[0];

    res.status(201).json({
      message: 'Review submitted successfully',
      review: {
        ...newReview,
        user_name: author?.name || 'Customer',
        user_email: author?.email || ''
      },
      updatedProduct: {
        rating: Number(avgRating),
        reviews: Number(revCount)
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error saving review' });
  } finally {
    client.release();
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.review_id, r.user_id, r.product_id, r.rating, r.comment, r.created_at,
              u.name as user_name, u.email as user_email,
              p.title as product_title, p.image_url as product_image
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       JOIN products p ON r.product_id = p.product_id
       ORDER BY r.created_at DESC`
    );

    res.json({ reviews: result.rows });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error fetching all reviews' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const isAdmin = req.user?.role === 'admin';

    // Find review first to check ownership and get product_id
    const findRes = await client.query('SELECT * FROM reviews WHERE review_id = $1', [id]);
    if (findRes.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = findRes.rows[0];
    if (!isAdmin && review.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await client.query('BEGIN');

    await client.query('DELETE FROM reviews WHERE review_id = $1', [id]);

    // Recalculate stats for the product
    const statsRes = await client.query(
      `SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*)::int as rev_count
       FROM reviews
       WHERE product_id = $1`,
      [review.product_id]
    );

    const avgRating = statsRes.rows[0]?.avg_rating || 5.0;
    const revCount = statsRes.rows[0]?.rev_count || 0;

    await client.query(
      `UPDATE products 
       SET rating = $1, reviews = $2
       WHERE product_id = $3`,
      [avgRating, revCount, review.product_id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  } finally {
    client.release();
  }
};
