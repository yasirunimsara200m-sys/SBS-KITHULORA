// src/controllers/productController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort, limit = '12', page = '1' } = req.query;
    
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    // Filter by category
    if (category && category !== 'All') {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Search by title
    if (search) {
      query += ` AND title ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price_low':
          query += ' ORDER BY price ASC';
          break;
        case 'price_high':
          query += ' ORDER BY price DESC';
          break;
        case 'rating':
          query += ' ORDER BY rating DESC';
          break;
        default:
          query += ' ORDER BY created_at DESC';
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), offset);

    const result = await pool.query(query, params);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products WHERE 1=1 ${
      category && category !== 'All' ? ` AND category = '${category}'` : ''
    } ${search ? ` AND title ILIKE '%${search}%'` : ''}`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, stock_quantity, image_url, category, is_bestseller, is_organic } = req.body;

    if (!title || !price || stock_quantity === undefined) {
      return res.status(400).json({ message: 'Title, price, and stock quantity are required' });
    }

    const result = await pool.query(
      `INSERT INTO products 
       (title, description, price, stock_quantity, image_url, category, is_bestseller, is_organic) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [title, description, price, stock_quantity, image_url, category, is_bestseller || false, is_organic || false]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock_quantity, image_url, category, is_bestseller, is_organic } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           stock_quantity = COALESCE($4, stock_quantity),
           image_url = COALESCE($5, image_url),
           category = COALESCE($6, category),
           is_bestseller = COALESCE($7, is_bestseller),
           is_organic = COALESCE($8, is_organic)
       WHERE product_id = $9
       RETURNING *`,
      [title, description, price, stock_quantity, image_url, category, is_bestseller, is_organic, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { limit = '4' } = req.query;
    const result = await pool.query(
      'SELECT * FROM products WHERE is_bestseller = true ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};