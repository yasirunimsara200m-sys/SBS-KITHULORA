-- ========================================================
-- SBS KITHULORA - Database Schema & Initial Data
-- Pure Kithul. Pure Sri Lanka.
-- Compatible with PostgreSQL 14+, Neon.tech, Supabase, Render
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 50,
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'Treacle',
    rating DECIMAL(3, 2) DEFAULT 4.90,
    reviews INT DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT false,
    is_organic BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 5. Cart Table
CREATE TABLE IF NOT EXISTS cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Seed Products (SBS KITHULORA Official Catalog)
-- ========================================================

INSERT INTO products (title, description, price, stock_quantity, image_url, category, is_bestseller, is_organic) VALUES
-- 1. Kithul Treacle
('Premium Kithul Treacle (කිතුල් පැණි) 750ml Glass Bottle', '100% Pure authentic Ceylon Kithul treacle harvested from natural Sinharaja border highlands. Sealed glass bottle with premium export-grade label. Ideal for hotels, fine dining restaurants, and households.', 1950.00, 85, '/assets/products/kithul-treacle.jpg', 'Treacle', true, true),
('Premium Kithul Treacle (කිතුල් පැණි) 500ml Glass Bottle', '100% Pure natural Kithul treacle in an airtight 500ml glass bottle. Golden amber color, traditional wooden tapping process with zero added sugar.', 1350.00, 120, '/assets/products/kithul-treacle.jpg', 'Treacle', true, true),
('Premium Kithul Treacle (කිතුල් පැණි) 375ml Glass Bottle', 'Pure grade authentic Kithul syrup in a sleek 375ml glass bottle. Perfect gift and dining table companion for breakfast and desserts.', 1050.00, 90, '/assets/products/kithul-treacle.jpg', 'Treacle', false, true),
('Premium Kithul Treacle (කිතුල් පැණි) 250ml Glass Bottle', 'Compact 250ml tourist & sampler pack. Pure unadulterated treacle with rich smoky aroma and low glycemic index.', 750.00, 150, '/assets/products/kithul-treacle.jpg', 'Treacle', false, true),

-- 2. Kithul Jaggery
('Traditional Kithul Jaggery (කිතුල් හකුරු) Premium Pack 500g', 'Authentic solid Kithul Hakuru made strictly from boiled virgin sap. Naturally crystallized without artificial additives or cane sugar.', 1400.00, 70, '/assets/products/kithul-jaggery.jpg', 'Jaggery', true, true),
('Kithul Jaggery Cubes (තේ/කෝපි සඳහා හකුරු කැට) 250g', 'Convenient ready-to-serve small jaggery cubes and granules designed to dissolve quickly in hot tea, herbal infusions, and coffee.', 750.00, 110, '/assets/products/kithul-jaggery.jpg', 'Jaggery', true, true),
('Traditional Kithul Jaggery (කිතුල් හකුරු) 250g Pack', 'Classic handmade half-coconut shell shaped pure jaggery cake. Rich caramel aroma and wholesome healthy sweetness.', 700.00, 80, '/assets/products/kithul-jaggery.jpg', 'Jaggery', false, true),
('Kithul Jaggery Mini Pack (කිතුල් හකුරු) 100g', 'Pocket-sized authentic Kithul jaggery cube pack for quick snacking with black tea or on-the-go energy.', 320.00, 130, '/assets/products/kithul-jaggery.jpg', 'Jaggery', false, true),

-- 3. Kithul Toffee
('Kithul Cashew Toffee (කජු කිතුල් ටොෆි) 200g Pack', 'Luxurious artisan confectionery combining crunchy oven-roasted Sri Lankan cashew nuts with slow-simmered caramelized Kithul treacle.', 850.00, 95, '/assets/products/kithul-toffee.jpg', 'Toffee', true, false),
('Kithul Coconut Toffee (පොල් කිතුල් ටොෆි) 200g Pack', 'Traditional Sri Lankan favorite infused with freshly shredded coconut scrapings and rich dark Kithul reduction.', 650.00, 120, '/assets/products/kithul-toffee.jpg', 'Toffee', false, false),
('Spiced Kithul Ginger Toffee (ඉඟුරු කිතුල් ටොෆි) 150g Pack', 'Zesty bite made with organic Ceylon ginger extract and pure Kithul sweetness. Perfect warming digestif sweet.', 550.00, 75, '/assets/products/kithul-toffee.jpg', 'Toffee', false, false),
('Classic Ceylon Kithul Toffee (සාම්ප්‍රදායික කිතුල් ටොෆි) 200g Pack', 'Melt-in-your-mouth chewy toffee prepared following time-honored southern village recipes with pure Kithul syrup.', 590.00, 100, '/assets/products/kithul-toffee.jpg', 'Toffee', false, false),

-- 4. Dessert Syrup
('Deniyaya Kithul Dessert Syrup (දෙණියාය කිතුල් සිරප්) 350ml Bottle', 'Specially crafted dessert sauce with velvety pouring consistency. The ultimate companion for Sri Lankan curd (මී කිරි), pancakes, waffles, french toast, and vanilla ice cream.', 1150.00, 140, '/assets/products/kithul-dessert-syrup.jpg', 'Dessert Syrup', true, true),

-- 5. Kithul Flour
('Pure Organic Kithul Flour (කිතුල් පිටි) 1kg Family Pack', 'Official Ceylon export-grade 100% natural Kithul palm pith flour. Highly revered for its body cooling properties, ideal for wholesome Kithul porridge (කැඳ), Thalapa, and desserts.', 1800.00, 60, '/assets/products/kithul-flour.jpg', 'Kithul Flour', true, true),
('Pure Organic Kithul Flour (කිතුල් පිටි) 500g Pack', 'Finely ground, sun-dried pure Kithul pith flour. Free from starch fillers or bleaching agents. Wholesome nutrition for the entire family.', 950.00, 90, '/assets/products/kithul-flour.jpg', 'Kithul Flour', false, true),
('Pure Organic Kithul Flour (කිතුල් පිටි) 200g Trial Pack', 'Sample size sealed pouch of 100% authentic southern Kithul palm starch for traditional home cooking.', 420.00, 110, '/assets/products/kithul-flour.jpg', 'Kithul Flour', false, true)
ON CONFLICT DO NOTHING;