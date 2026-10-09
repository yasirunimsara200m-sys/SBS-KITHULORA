import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, Banknote, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/currency';

const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storageKey = user ? `kithul_addresses_${user.id}` : 'kithul_addresses_guest';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedAddresses(parsed);
        const def = parsed.find((a: any) => a.isDefault) || parsed[0];
        if (def) {
          setShippingInfo(prev => ({
            ...prev,
            address: prev.address || def.street,
            city: prev.city || def.city,
            zip: prev.zip || def.zip || ''
          }));
        }
      }
    } catch {}
  }, [user]);

  const shipping = cartTotal > 10000 ? 0 : 350;
  const tax = 0;
  const total = cartTotal + shipping + tax;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const shippingAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`;
      const res = await orderService.create({
        shipping_address: shippingAddress,
        payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price)
        }))
      });
      clearCart();
      navigate('/order-success', { state: { orderId: res.order?.order_id } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Checkout</h1>
          <p className="text-gray-500 text-center mb-8">Complete your order with confidence</p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > num ? <CheckCircle className="w-6 h-6" /> : num}
                </div>
                {num < 3 && <div className={`w-12 h-0.5 ${step > num ? 'bg-amber-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-xl text-center">{error}</div>}

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Step 1: Shipping */}
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>

                    {savedAddresses.length > 0 && (
                      <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" /> Quick Select from Saved Addresses:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {savedAddresses.map(addr => (
                            <button
                              type="button"
                              key={addr.id}
                              onClick={() => {
                                setShippingInfo(prev => ({
                                  ...prev,
                                  address: addr.street,
                                  city: addr.city,
                                  zip: addr.zip || '',
                                }));
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left flex items-center gap-1.5 shadow-xs ${
                                shippingInfo.address === addr.street
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white hover:bg-amber-100/50 text-gray-800 border-amber-200'
                              }`}
                            >
                              <span>{addr.type}:</span>
                              <span className="font-normal truncate max-w-[150px]">{addr.street}, {addr.city}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); setStep(2); }}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <input type="text" required value={shippingInfo.firstName} onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <input type="text" required value={shippingInfo.lastName} onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" required value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" required value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                        <input type="text" required value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input type="text" required value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input type="text" required value={shippingInfo.state} onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input type="text" required value={shippingInfo.zip} onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        Continue to Payment
                      </button>
                    </form>
                  </>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {/* Cash on Delivery option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                            : 'border-gray-200 hover:border-amber-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Banknote className="w-5 h-5" />
                          </div>
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-amber-600' : 'border-gray-300'}`}>
                            {paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm">Cash on Delivery (COD)</h4>
                        <p className="text-xs text-gray-500 mt-1">Pay with cash when your honey arrives at your doorstep</p>
                      </button>

                      {/* Card Payment option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          paymentMethod === 'card'
                            ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                            : 'border-gray-200 hover:border-amber-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-amber-600' : 'border-gray-300'}`}>
                            {paymentMethod === 'card' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm">Credit / Debit Card</h4>
                        <p className="text-xs text-gray-500 mt-1">Pay securely online with Visa, Mastercard or Amex</p>
                      </button>
                    </div>

                    {paymentMethod === 'cod' ? (
                      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-bold text-emerald-900">Zero Upfront Payment Required</h5>
                          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                            Your order will be packaged and dispatched immediately. You will pay <strong className="font-black text-emerald-900">{formatPrice(total)}</strong> in cash to the courier upon delivery.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                        Back
                      </button>
                      <button onClick={handlePlaceOrder} disabled={loading}
                        className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70">
                        {loading ? 'Placing Order...' : paymentMethod === 'cod' ? 'Confirm Cash on Delivery Order' : 'Place Order & Pay'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {cartItems.map(item => (
                    <div key={item.cart_id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">{item.title} x{item.quantity}</span>
                      <span className="font-medium ml-2">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping (Island-wide)</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Taxes</span><span className="text-green-600 font-medium">Included</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout • Your info is safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;