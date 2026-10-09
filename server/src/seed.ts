import bcrypt from 'bcryptjs';
import pool from './config/db';

async function seed() {
  try {
    // 1. Admin User
    const name = 'Shalanka Sathsara';
    const email = 'sbskithul@gmail.com';
    const password = 'sbskithul2000';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const checkUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [name, email, hash, 'admin']
      );
      console.log('✅ Admin user created: ' + email);
    } else {
      await pool.query(
        'UPDATE users SET role = $1, password_hash = $2 WHERE email = $3',
        ['admin', hash, email]
      );
      console.log('✅ Admin user updated: ' + email);
    }

    // 2. Sample Products
    const checkProducts = await pool.query('SELECT count(*) FROM products');
    if (parseInt(checkProducts.rows[0].count) === 0) {
      const sampleProducts = [
        ['Pure Kithul Honey - Premium Grade', 'Experience the pure, unadulterated taste of Kithul honey, harvested from wild Kithul trees.', 24.99, 100, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 'Pure', 4.9, 128, true, true],
        ['Organic Kithul Honey', 'Certified organic Kithul honey with all natural goodness preserved.', 29.99, 75, 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500', 'Organic', 4.8, 95, true, true],
        ['Kithul Honey Gift Set', 'Beautiful gift set with premium Kithul honey and traditional wooden spoon.', 49.99, 30, 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500', 'Gift Sets', 4.7, 67, false, true],
        ['Infused Kithul Honey - Ginger', 'Kithul honey infused with fresh ginger for a spicy kick.', 27.99, 50, 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500', 'Infused', 4.6, 43, false, true],
        ['Kithul Honey - Travel Size', 'Perfect for on-the-go, 100ml travel size bottle.', 14.99, 200, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 'Pure', 4.5, 234, false, false],
        ['Premium Kithul Honey - 1kg', 'Large 1kg jar of pure Kithul honey for the true honey lover.', 59.99, 25, 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500', 'Pure', 4.9, 156, true, true]
      ];

      for (const p of sampleProducts) {
        await pool.query(
          `INSERT INTO products (title, description, price, stock_quantity, image_url, category, rating, reviews, is_bestseller, is_organic)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          p
        );
      }
      console.log('✅ 6 Products inserted successfully');
    } else {
      console.log('ℹ️ Products already exist in database');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
