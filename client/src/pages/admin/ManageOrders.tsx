import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle, XCircle, ArrowLeft, ChevronDown, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
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
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_method?: string;
  created_at: string;
  items?: OrderItem[];
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.order_id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 md:p-8">
      <div className="container mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/admin" className="hover:text-amber-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </Link>
          <span>/</span>
          <span className="text-amber-600 font-semibold">Manage Orders</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-gray-500 mt-1">Track and update customer fulfillment</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm shadow-sm"
          >
            Refresh Orders
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === status 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg">No orders found</p>
              <p className="text-sm mt-1">Orders placed by customers will appear here</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Order #{order.order_id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 truncate max-w-xs">
                        📍 {order.shipping_address}
                      </p>
                      <p className="text-xs font-semibold text-amber-800 mt-1">
                        💵 Payment: <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-900">{order.payment_method || 'Credit Card'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="font-bold text-amber-600 text-lg">{formatPrice(Number(order.total_amount))}</p>
                    </div>

                    {/* Status Dropdown */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <select
                        value={order.status}
                        disabled={updatingId === order.order_id}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2.5 hover:bg-amber-50 rounded-xl transition-colors text-amber-600 border border-amber-200"
                      title="View Order Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">Order #{selectedOrder.order_id}</h2>
            <p className="text-xs text-gray-400 mb-4">{new Date(selectedOrder.created_at).toLocaleString()}</p>

            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Delivery Address</span>
              <p className="text-sm font-medium text-gray-800">{selectedOrder.shipping_address}</p>
            </div>

            <div className="mb-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 flex justify-between items-center">
              <span className="text-xs text-amber-900 font-semibold">Payment Method</span>
              <span className="text-xs font-bold bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full">{selectedOrder.payment_method || 'Credit Card'}</span>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Items in Order</span>
              <div className="space-y-2">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm">
                      <div>
                        <span className="font-semibold text-gray-800 block">{it.title || `Product #${it.product_id}`}</span>
                        <span className="text-xs text-gray-400">Qty: {it.quantity} x {formatPrice(Number(it.price))}</span>
                      </div>
                      <span className="font-bold text-amber-600">
                        {formatPrice(it.quantity * Number(it.price))}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No item details available</p>
                )}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-amber-600">{formatPrice(Number(selectedOrder.total_amount))}</span>
            </div>

            <div className="mt-6 flex gap-2">
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.order_id, e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm outline-none"
              >
                <option value="Pending">Mark Pending</option>
                <option value="Processing">Mark Processing</option>
                <option value="Shipped">Mark Shipped</option>
                <option value="Delivered">Mark Delivered</option>
                <option value="Cancelled">Mark Cancelled</option>
              </select>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;