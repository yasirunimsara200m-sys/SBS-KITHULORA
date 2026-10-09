import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleStartShopping = () => {
    onClose();
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
              <span className="bg-amber-100 text-amber-700 text-sm px-2.5 py-0.5 rounded-full font-medium">
                {cartItems.length}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Please login to view your cart</p>
                <button 
                  onClick={() => { onClose(); navigate('/login'); }}
                  className="mt-4 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Sign In
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <button 
                  onClick={handleStartShopping}
                  className="mt-4 text-amber-600 font-semibold hover:text-amber-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cart_id} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                  <img 
                    src={item.image_url || '/api/placeholder/80/80'} 
                    alt={item.title} 
                    className="w-20 h-20 rounded-lg object-cover" 
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-amber-600 font-bold mt-1">{formatPrice(Number(item.price))}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.cart_id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors ml-auto text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {isAuthenticated && cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-800 text-lg">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-500">Calculated at checkout</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;