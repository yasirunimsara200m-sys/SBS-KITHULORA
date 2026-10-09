import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  Shield, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle, 
  ShoppingBag, 
  DollarSign, 
  Award,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../../utils/currency';

interface OrderItem {
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface Order {
  order_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_method?: string;
  created_at: string;
  items?: OrderItem[];
}

const Profile: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'orders', 'addresses', 'wishlist', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Addresses State with LocalStorage persistence per user
  const storageKey = user ? `kithul_addresses_${user.id}` : 'kithul_addresses_guest';

  const defaultAddresses = [
    { id: 1, type: 'Home', street: 'No.137, "Buddhinim", ViskamUyana', city: 'Warakapitiya, Denipitiya', zip: '81700', isDefault: true },
    { id: 2, type: 'Office', street: '45/2 Galle Road', city: 'Colombo 03', zip: '00300', isDefault: false }
  ];

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultAddresses;
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    street: '',
    city: '',
    zip: '',
    isDefault: false
  });
  const [addressNotice, setAddressNotice] = useState('');

  // Auto-sync addresses with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(addresses));
    } catch (e) {
      console.error(e);
    }
  }, [addresses, storageKey]);

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      type: 'Home',
      street: '',
      city: '',
      zip: '',
      isDefault: addresses.length === 0
    });
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      type: addr.type,
      street: addr.street,
      city: addr.city,
      zip: addr.zip || '',
      isDefault: !!addr.isDefault
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.street.trim() || !addressForm.city.trim()) return;

    if (editingAddressId !== null) {
      // Edit mode
      setAddresses(prev => {
        return prev.map(a => {
          if (a.id === editingAddressId) {
            return {
              ...a,
              type: addressForm.type.trim() || 'Home',
              street: addressForm.street.trim(),
              city: addressForm.city.trim(),
              zip: addressForm.zip.trim(),
              isDefault: addressForm.isDefault
            };
          }
          return addressForm.isDefault ? { ...a, isDefault: false } : a;
        });
      });
      setAddressNotice('Address updated successfully!');
    } else {
      // Add mode
      const newId = Date.now();
      const shouldBeDefault = addressForm.isDefault || addresses.length === 0;
      setAddresses(prev => {
        const updated = shouldBeDefault ? prev.map(a => ({ ...a, isDefault: false })) : [...prev];
        return [
          ...updated,
          {
            id: newId,
            type: addressForm.type.trim() || 'Home',
            street: addressForm.street.trim(),
            city: addressForm.city.trim(),
            zip: addressForm.zip.trim(),
            isDefault: shouldBeDefault
          }
        ];
      });
      setAddressNotice('New delivery address saved!');
    }

    setTimeout(() => setAddressNotice(''), 3500);
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return;
    setAddresses(prev => {
      const remaining = prev.filter(a => a.id !== id);
      const deletedWasDefault = prev.find(a => a.id === id)?.isDefault;
      if (deletedWasDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
    setAddressNotice('Address deleted.');
    setTimeout(() => setAddressNotice(''), 3000);
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    setAddressNotice('Default delivery address updated.');
    setTimeout(() => setAddressNotice(''), 3000);
  };

  // Wishlist Demo State
  const [wishlist, setWishlist] = useState([
    { id: 1, title: 'Pure Kithul Honey - Premium Grade', price: 24.99, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300' },
    { id: 2, title: 'Kithul Honey Gift Set', price: 49.99, image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=300' }
  ]);

  // Profile Edit State
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  useEffect(() => {
    setLoadingOrders(true);
    orderService.getMyOrders()
      .then(data => setOrders(data.orders || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingOrders(false));
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Shipped');

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };


  const handleRemoveWishlist = (id: number) => {
    setWishlist(wishlist.filter(w => w.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: User },
    { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Customer Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner">
                🍯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user?.name || 'Valued Customer'}</h1>
                  <span className="bg-amber-800/40 text-amber-100 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-300/30">
                    VIP Member
                  </span>
                </div>
                <p className="text-amber-100 text-sm mt-1">{user?.email}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-amber-100">
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-yellow-300" /> 180 Reward Points</span>
                  <span>•</span>
                  <span>Member since 2024</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-5 py-2.5 bg-white text-amber-700 font-bold rounded-xl shadow-md hover:bg-amber-50 transition-all text-sm flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
              )}
              <Link
                to="/shop"
                className="px-5 py-2.5 bg-amber-800/50 hover:bg-amber-800/70 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all text-sm flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" /> Shop Honey
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-amber-100/60 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/60'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-800">{formatPrice(totalSpent)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Active Deliveries</p>
                  <p className="text-2xl font-bold text-gray-800">{activeOrders.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Reward Points</p>
                  <p className="text-2xl font-bold text-gray-800">180 Pts</p>
                </div>
              </div>
            </div>

            {/* Active Orders Track or Promo */}
            {activeOrders.length > 0 ? (
              <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" /> Current Delivery Status
                  </h2>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-600 font-semibold hover:underline">
                    View All Orders
                  </button>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-800">Order #{activeOrders[0].order_id}</span>
                    <span className="text-amber-700 font-bold">{formatPrice(Number(activeOrders[0].total_amount))}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Delivery to: {activeOrders[0].shipping_address}</p>

                  {/* Step Progress Bar */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((stepName, i) => {
                      const currStep = getStatusStep(activeOrders[0].status);
                      const isComplete = currStep >= (i + 1);
                      return (
                        <div key={stepName} className="space-y-1">
                          <div className={`h-2 rounded-full ${isComplete ? 'bg-amber-500' : 'bg-gray-200'}`} />
                          <span className={`font-semibold ${isComplete ? 'text-amber-700' : 'text-gray-400'}`}>
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold">Discover Fresh Harvested Pure Kithul Honey!</h3>
                  <p className="text-amber-100 text-sm mt-1 max-w-lg">
                    Order 100% natural wild harvested honey directly from traditional Sri Lankan tree-tappers. Free delivery on orders over Rs. 10,000.
                  </p>
                </div>
                <Link to="/shop" className="px-6 py-3 bg-white text-amber-600 font-bold rounded-xl shadow-lg hover:bg-amber-50 transition-all text-sm whitespace-nowrap">
                  Explore Catalog 🍯
                </Link>
              </div>
            )}

            {/* Quick Two Column: Recent Orders & Wishlist */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-600 font-semibold hover:underline">
                    See All
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-gray-400 text-sm py-6 text-center">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(o => (
                      <div key={o.order_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Order #{o.order_id}</p>
                          <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600 text-sm">{formatPrice(Number(o.total_amount))}</p>
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Favorite Honey</h3>
                  <button onClick={() => setActiveTab('wishlist')} className="text-xs text-amber-600 font-semibold hover:underline">
                    View Wishlist
                  </button>
                </div>

                <div className="space-y-3">
                  {wishlist.slice(0, 2).map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                        <p className="text-xs font-bold text-amber-600">{formatPrice(item.price)}</p>
                      </div>
                      <Link to="/shop" className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-bold">
                        Buy
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order History & Tracking</h2>
            <p className="text-gray-500 text-sm mb-6">Track live deliveries and view invoice receipts</p>

            {loadingOrders ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-amber-300" />
                <p className="text-lg font-semibold text-gray-700">You haven't placed any orders yet</p>
                <p className="text-sm text-gray-500 mt-1">Browse our collection of organic Kithul honey and place your first order.</p>
                <Link to="/shop" className="mt-4 inline-block px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold text-sm shadow-md hover:scale-105 transition-all">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const step = getStatusStep(order.status);
                  return (
                    <div key={order.order_id} className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-gray-50/50 to-amber-50/30 hover:shadow-md transition-all">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-lg">Order #{order.order_id}</h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                          <p className="text-xs text-gray-600 mt-1">📍 Destination: {order.shipping_address}</p>
                          <p className="text-xs font-semibold text-amber-800 mt-1">
                            💳 Payment: <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-900">{order.payment_method || 'Credit Card'}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium">Total Paid</p>
                          <p className="text-2xl font-black text-amber-600">{formatPrice(Number(order.total_amount))}</p>
                        </div>
                      </div>

                      {/* Tracker */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 my-4">
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          {['Order Placed', 'Processing', 'On The Way', 'Delivered'].map((stepTitle, idx) => (
                            <div key={stepTitle} className="space-y-1">
                              <div className={`h-2 rounded-full ${step >= (idx + 1) ? 'bg-amber-500' : 'bg-gray-200'}`} />
                              <span className={`font-semibold ${step >= (idx + 1) ? 'text-amber-700' : 'text-gray-400'}`}>
                                {stepTitle}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200/60 space-y-2">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-gray-700">
                              <span>{it.title || `Product #${it.product_id}`} × {it.quantity}</span>
                              <span className="font-semibold">{formatPrice(Number(it.price) * it.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                <p className="text-gray-500 text-sm">Manage your delivery locations for faster checkout</p>
              </div>
              <button
                onClick={handleOpenAddAddress}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-lg text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {/* Notification alert */}
            {addressNotice && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-pulse-once">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> {addressNotice}
              </div>
            )}

            {/* Add / Edit Address Form Modal / Inline Box */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="mb-8 p-6 bg-gradient-to-br from-amber-50/90 to-orange-50/50 border border-amber-200 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    {editingAddressId !== null ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                    className="p-1 hover:bg-amber-100 rounded-full text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Address Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Office, Work"
                      value={addressForm.type}
                      onChange={e => setAddressForm({ ...addressForm, type: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 45/2 Galle Road, Bambalapitiya"
                      value={addressForm.street}
                      onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">City / Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Colombo, Kandy"
                      value={addressForm.city}
                      onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Postal / ZIP Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 00300"
                      value={addressForm.zip}
                      onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-700">Set as default address</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow transition-all"
                  >
                    {editingAddressId !== null ? 'Save Changes' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards List */}
            {addresses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MapPin className="w-12 h-12 text-amber-200 mx-auto mb-2" />
                <p className="font-semibold text-gray-700">No saved addresses yet</p>
                <p className="text-xs text-gray-400 mt-1">Add your shipping address so you won't have to type it on checkout.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl relative transition-all bg-white border flex flex-col justify-between ${
                      addr.isDefault ? 'border-amber-400 shadow-sm ring-1 ring-amber-300/50' : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-amber-600" /> {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>

                        {/* Action buttons: Edit & Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm font-medium">{addr.street}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{addr.city}{addr.zip ? `, ${addr.zip}` : ''}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      {addr.isDefault ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Default Shipping Address
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-amber-700 hover:text-amber-900 font-semibold hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Saved Honey</h2>
            <p className="text-gray-500 text-sm mb-6">Products you have saved for later</p>

            {wishlist.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Heart className="w-12 h-12 mx-auto mb-2 text-rose-300" />
                <p>Your wishlist is empty</p>
                <Link to="/shop" className="text-amber-600 text-sm font-semibold hover:underline mt-2 inline-block">
                  Discover Products
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map(item => (
                  <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group bg-white">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-lg font-black text-amber-600 mt-1">{formatPrice(item.price)}</p>
                      
                      <div className="flex gap-2 mt-4">
                        <Link 
                          to="/shop"
                          className="flex-1 py-2 text-center bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl text-xs font-bold hover:shadow-md transition-all"
                        >
                          View in Shop
                        </Link>
                        <button 
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-xl"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h2>
            <p className="text-gray-500 text-sm mb-6">Manage your contact information and security preferences</p>

            {savedSettingsNotice && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="bg-transparent w-full text-sm text-gray-800 font-medium outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="bg-transparent w-full text-sm text-gray-800 font-medium outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-amber-500">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="bg-transparent w-full text-sm text-gray-800 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-md hover:scale-[1.02] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Session & Security</h4>
              <button
                onClick={logout}
                className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors"
              >
                Sign Out from All Devices
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;