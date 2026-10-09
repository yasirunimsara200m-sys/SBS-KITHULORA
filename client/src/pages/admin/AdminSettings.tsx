import React, { useState } from 'react';
import { ArrowLeft, Save, Shield, Store, Bell, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // Store config
  const [storeName, setStoreName] = useState('SBS KITHULORA');
  const [contactEmail, setContactEmail] = useState('support@sbskithulora.com');
  const [currency, setCurrency] = useState('LKR (Rs)');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('10000.00');
  const [shippingFee, setShippingFee] = useState('350.00');
  const [orderNotification, setOrderNotification] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/admin" className="hover:text-amber-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </Link>
          <span>/</span>
          <span className="text-amber-600 font-semibold">Store Settings</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin & Store Settings</h1>
            <p className="text-gray-500 mt-1">Configure store parameters, shipping, and administrative options</p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl flex items-center gap-2 text-sm font-semibold animate-fade-in border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Administrator Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Administrator Profile</h2>
                <p className="text-xs text-gray-400">Current authenticated account</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admin Name</label>
                <input 
                  type="text" 
                  disabled 
                  value={user?.name || ''} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email || ''} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700" 
                />
              </div>
            </div>
          </div>

          {/* Store Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-700">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">General Store Configuration</h2>
                <p className="text-xs text-gray-400">Customer facing parameters</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input 
                  type="text" 
                  required
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact / Support Email</label>
                <input 
                  type="email" 
                  required
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white"
                >
                  <option value="LKR (Rs)">LKR (Rs)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Shipping (LKR / Rs.)</label>
                <input 
                  type="number" 
                  step="1" 
                  value={shippingFee} 
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Over (LKR / Rs.)</label>
                <input 
                  type="number" 
                  step="1" 
                  value={freeShippingThreshold} 
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                <p className="text-xs text-gray-400">Order alerts and system messages</p>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer py-2">
              <input 
                type="checkbox" 
                checked={orderNotification} 
                onChange={(e) => setOrderNotification(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" 
              />
              <span className="text-sm font-medium text-gray-700">Email alert when a new customer order is placed</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
