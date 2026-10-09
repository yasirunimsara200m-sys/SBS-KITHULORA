import pool from './config/db';

async function initCart() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart (
        cart_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `);
    console.log('✅ CART TABLE CREATED SUCCESSFULLY IN DATABASE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create cart table:', err);
    process.exit(1);
  }
}

initCart();
