import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const Cart: React.FC = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 10000 ? 0 : 350;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  // Login olmadıysa
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-amber-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
          <p className="text-gray-500 mb-6">You need to login to view your cart</p>
          <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">{cartItems.length} items</span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious Kithul honey to get started!</p>
            <Link to="/shop" className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                {cartItems.map(item => (
                  <div key={item.cart_id} className="flex gap-6 py-6 border-b border-gray-100 last:border-0">
                    <img src={item.image_url || '/api/placeholder/120/120'} alt={item.title} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-amber-600 font-bold mt-1">{formatPrice(Number(item.price))}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center bg-gray-100 rounded-full">
                          <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)} className="p-1.5 hover:bg-gray-200 rounded-l-full transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)} className="p-1.5 hover:bg-gray-200 rounded-r-full transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.cart_id)} className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatPrice(Number(item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/shop" className="mt-4 text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1 w-fit">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping (Island-wide)</span>
                    <span className="font-medium">{shipping === 0 ? '🎉 Free!' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium text-green-600">Included</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-amber-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
                {shipping > 0 && (
                  <p className="text-xs text-center text-gray-400 mt-3">
                    Add {formatPrice(10000 - cartTotal)} more for free delivery!
                  </p>
                )}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">Secure checkout • Free returns</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;