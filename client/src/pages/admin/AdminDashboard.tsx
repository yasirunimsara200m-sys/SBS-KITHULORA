import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, DollarSign, Settings, Plus, ArrowRight, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { formatPrice } from '../../utils/currency';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [orderStatsData, productsData, usersData, ordersData] = await Promise.allSettled([
          orderService.getStats(),
          productService.getAll({ limit: 100 as any }),
          userService.getAll(),
          orderService.getAll(),
        ]);

        const orderStats = orderStatsData.status === 'fulfilled' ? orderStatsData.value : null;
        const products = productsData.status === 'fulfilled' ? productsData.value?.products || [] : [];
        const users = usersData.status === 'fulfilled' ? usersData.value?.users || [] : [];
        const allOrders = ordersData.status === 'fulfilled' ? ordersData.value?.orders || [] : [];

        setStats({
          totalRevenue: orderStats?.totalRevenue ?? 0,
          totalOrders: orderStats?.totalOrders ?? allOrders.length,
          totalProducts: products.length,
          totalUsers: users.length,
        });

        setRecentOrders(allOrders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(Number(stats.totalRevenue)),
      icon: DollarSign,
      color: 'bg-green-500',
      change: 'Live DB',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: 'Live DB',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-purple-500',
      change: 'In Catalog',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-orange-500',
      change: 'Registered',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Administrator'} 🍯</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/admin/products?action=add')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-gray-500 text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mt-3">
                {loading ? '...' : stat.value}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Customer Orders</h2>
              <Link 
                to="/admin/orders" 
                className="text-amber-600 font-semibold hover:text-amber-700 text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400">Loading recent orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p>No customer orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.order_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Order #{order.order_id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString()} • 📍 {order.shipping_address?.split(',')[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{formatPrice(Number(order.total_amount))}</p>
                      <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Management</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-all text-left border border-amber-100/50 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Manage Products</p>
                      <p className="text-xs text-gray-500">Add, edit prices, update stock</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/orders')}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all text-left border border-blue-100/50 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Manage Orders</p>
                      <p className="text-xs text-gray-500">Track shipping & fulfill orders</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all text-left border border-purple-100/50 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Manage Users</p>
                      <p className="text-xs text-gray-500">View accounts & permissions</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/reviews')}
                className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all text-left border border-emerald-100/50 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Customer Reviews</p>
                      <p className="text-xs text-gray-500">Moderate product ratings & feedback</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/settings')}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl hover:shadow-md transition-all text-left border border-gray-200/50 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-700" />
                    <div>
                      <p className="font-semibold text-gray-800">Store Settings</p>
                      <p className="text-xs text-gray-500">Currency, shipping, config</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;