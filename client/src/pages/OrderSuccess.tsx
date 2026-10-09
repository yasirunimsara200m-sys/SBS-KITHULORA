// OrderSuccess.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Truck, Mail, Home, ArrowRight } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;
  const orderNumber = orderId ? `ORD-${orderId}` : 'ORD-2024-001234';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8 md:p-12 text-center border border-amber-100">
        <div className="inline-flex p-4 bg-green-100 rounded-full mb-6 animate-bounce-slow">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Thank You!</h1>
        <p className="text-gray-500 text-lg">Your order has been placed successfully</p>
        
        <div className="bg-amber-50 rounded-2xl p-5 my-6 border border-amber-200/60 inline-block w-full">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Order Reference</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{orderNumber}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 my-8">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <ShoppingBag className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-gray-700 font-bold">Order Confirmed</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <Truck className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-gray-700 font-bold">Processing</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <Mail className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-gray-700 font-bold">Email Sent</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          We've sent a confirmation email with your order details. You can track the progress of your pure Kithul honey shipment anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/profile?tab=orders')}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('/shop')}
            className="px-8 py-3.5 border-2 border-amber-600 text-amber-600 rounded-full font-bold hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;