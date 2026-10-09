// src/controllers/orderController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export const createOrder = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.user_id;
    const { shipping_address, items, payment_method } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    await client.query('BEGIN');

    // Calculate total and verify stock
    let totalAmount = 0;
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price, stock_quantity FROM products WHERE product_id = $1',
        [item.product_id]
      );
      
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const product = productResult.rows[0];
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }

      totalAmount += parseFloat(product.price) * item.quantity;
    }

    // Create order
    const paymentMethod = payment_method || 'Card';
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status, payment_method) 
       VALUES ($1, $2, $3, 'Pending', $4) RETURNING *`,
      [userId, totalAmount, shipping_address, paymentMethod]
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price FROM products WHERE product_id = $1',
        [item.product_id]
      );
      
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.order_id, item.product_id, item.quantity, productResult.rows[0].price]
      );

      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        order_id: order.order_id,
        total_amount: order.total_amount,
        status: order.status,
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        created_at: order.created_at,
      },
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(400).json({ message: error.message || 'Failed to create order' });
  } finally {
    client.release();
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const isAdmin = req.user?.role === 'admin';

    let query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'title', p.title,
               'image_url', p.image_url
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;

    if (!isAdmin) {
      query += ` AND o.user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    query += ` GROUP BY o.order_id ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const isAdmin = req.user?.role === 'admin';

    let query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'title', p.title,
               'image_url', p.image_url
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.order_id = $1
    `;
    
    if (!isAdmin) {
      query += ` AND o.user_id = $2`;
      const result = await pool.query(query, [id, userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      return res.json({ order: result.rows[0] });
    }

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0],
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'Processing' THEN 1 END) as processing,
        COUNT(CASE WHEN status = 'Shipped' THEN 1 END) as shipped,
        COUNT(CASE WHEN status = 'Delivered' THEN 1 END) as delivered,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled
      FROM orders
    `);

    const stats = result.rows[0];
    res.json({
      totalOrders: parseInt(stats.total_orders) || 0,
      totalRevenue: parseFloat(stats.total_revenue) || 0,
      averageOrderValue: parseFloat(stats.average_order_value) || 0,
      statusCounts: {
        pending: parseInt(stats.pending) || 0,
        processing: parseInt(stats.processing) || 0,
        shipped: parseInt(stats.shipped) || 0,
        delivered: parseInt(stats.delivered) || 0,
        cancelled: parseInt(stats.cancelled) || 0,
      },
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};