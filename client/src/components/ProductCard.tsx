import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

interface Product {
  product_id: number;
  title: string;
  price: number;
  rating?: number;
  reviews?: number;
  image_url?: string;
  is_bestseller?: boolean;
  is_organic?: boolean;
  stock_quantity?: number;
}

interface ProductCardProps {
  product?: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const name = product?.title ?? 'Pure Kithul Honey';
  const price = product?.price ?? 2500;
  const rating = product?.rating ?? 4.9;
  const reviews = product?.reviews ?? 128;
  const image = product?.image_url ?? '/api/placeholder/300/300';
  const isBestseller = product?.is_bestseller ?? true;
  const isOrganic = product?.is_organic ?? true;
  const productId = product?.product_id;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId) {
      await addToCart(productId, 1);
    }
  };

  const handleClick = () => {
    if (productId) navigate(`/product/${productId}`);
  };

  return (
    <div onClick={handleClick} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        <img src={image} alt={name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBestseller && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">⭐ Bestseller</span>
          )}
          {isOrganic && (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">🌿 Organic</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-amber-50 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 hover:scale-110"
        >
          <ShoppingCart className="w-5 h-5 text-amber-600" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 hover:text-amber-600 transition-colors line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-sm font-semibold text-gray-700">{rating}</span>
              <span className="text-xs text-gray-400">({reviews} reviews)</span>
            </div>
          </div>
          <span className="text-xl font-bold text-amber-600 whitespace-nowrap">{formatPrice(price)}</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>In Stock
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Free Shipping</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;