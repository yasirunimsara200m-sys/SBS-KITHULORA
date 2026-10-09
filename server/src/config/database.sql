-- src/config/database.sql
-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    image_url TEXT,
    category VARCHAR(50),
    rating DECIMAL(3, 2) DEFAULT 4.9,
    reviews INT DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT false,
    is_organic BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 5. Cart Table
CREATE TABLE IF NOT EXISTS cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Admin', 'admin@kithul.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, price, stock_quantity, image_url, category, rating, reviews, is_bestseller, is_organic) VALUES
('Pure Kithul Honey - Premium Grade', 'Experience the pure, unadulterated taste of Kithul honey, harvested from the wild Kithul trees of Sri Lanka.', 24.99, 100, '/images/honey1.jpg', 'Pure', 4.9, 128, true, true),
('Organic Kithul Honey', 'Certified organic Kithul honey with all natural goodness preserved.', 29.99, 75, '/images/honey2.jpg', 'Organic', 4.8, 95, true, true),
('Kithul Honey Gift Set', 'Beautiful gift set with premium Kithul honey and traditional wooden spoon.', 49.99, 30, '/images/gift-set.jpg', 'Gift Sets', 4.7, 67, false, true),
('Infused Kithul Honey - Ginger', 'Kithul honey infused with fresh ginger for a spicy kick.', 27.99, 50, '/images/ginger-honey.jpg', 'Infused', 4.6, 43, false, true),
('Kithul Honey - Travel Size', 'Perfect for on-the-go, 100ml travel size bottle.', 14.99, 200, '/images/travel-honey.jpg', 'Pure', 4.5, 234, false, false),
('Premium Kithul Honey - 1kg', 'Large 1kg jar of pure Kithul honey for the true honey lover.', 59.99, 25, '/images/large-honey.jpg', 'Pure', 4.9, 156, true, true);