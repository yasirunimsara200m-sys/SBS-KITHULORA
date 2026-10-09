// src/types/custom.types.ts
export interface User {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'customer' | 'admin';
  created_at: Date;
}

export interface Product {
  product_id: number;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  created_at: Date;
}

export interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shipping_address: string;
  created_at: Date;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  title: string;
  image_url: string;
}

export interface JwtPayload {
  user_id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}