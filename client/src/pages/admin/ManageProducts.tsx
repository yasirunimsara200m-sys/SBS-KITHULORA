import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Check, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/currency';

interface Product {
  product_id: number;
  title: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  is_bestseller?: boolean;
  is_organic?: boolean;
}

const ManageProducts: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category: 'Treacle',
    is_bestseller: false,
    is_organic: false,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        limit: 100 as any,
      });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Open Add modal if url has ?action=add
  useEffect(() => {
    if (location.search.includes('action=add')) {
      handleOpenAddModal();
    }
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock_quantity: '50',
      image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
      category: 'Pure',
      is_bestseller: false,
      is_organic: false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      price: String(p.price),
      stock_quantity: String(p.stock_quantity),
      image_url: p.image_url || '',
      category: p.category || 'Pure',
      is_bestseller: !!p.is_bestseller,
      is_organic: !!p.is_organic,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.product_id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity, 10),
      image_url: formData.image_url,
      category: formData.category,
      is_bestseller: formData.is_bestseller,
      is_organic: formData.is_organic,
    };

    try {
      if (editingProduct) {
        await productService.update(editingProduct.product_id, payload);
      } else {
        await productService.create(payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 md:p-8">
      <div className="container mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/admin" className="hover:text-amber-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </Link>
          <span>/</span>
          <span className="text-amber-600 font-semibold">Manage Products</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
            <p className="text-gray-500 mt-1">Add, update or remove items from your store</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products by title..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              />
            </form>
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm"
              >
                <option value="All">All Categories (සියල්ල)</option>
                <option value="Treacle">Treacle (කිතුල් පැණි)</option>
                <option value="Jaggery">Jaggery (කිතුල් හකුරු)</option>
                <option value="Toffee">Toffee (කිතුල් ටොෆි)</option>
                <option value="Dessert Syrup">Dessert Syrup (කිතුල් සිරප්)</option>
                <option value="Kithul Flour">Kithul Flour (කිතුල් පිටි)</option>
              </select>
              <button
                onClick={() => fetchProducts()}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No products found</p>
              <button onClick={handleOpenAddModal} className="mt-3 text-amber-600 font-semibold hover:underline">
                Add your first product now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Badges</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image_url || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100'} 
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-amber-100" 
                          />
                          <div>
                            <span className="font-semibold text-gray-800 text-sm block line-clamp-1">{product.title}</span>
                            <span className="text-xs text-gray-400 line-clamp-1">{product.description || 'No description'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-200/50">
                          {product.category || 'Pure'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 text-sm">
                        {formatPrice(Number(product.price))}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.stock_quantity > 20 ? 'bg-green-100 text-green-700' :
                          product.stock_quantity > 0 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-1.5 flex-wrap">
                          {product.is_bestseller && (
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-medium">⭐ Bestseller</span>
                          )}
                          {product.is_organic && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">🌿 Organic</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-600"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.product_id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {editingProduct ? 'Update product details in your catalog' : 'Fill in the information to list a new item'}
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Pure Kithul Honey 500ml"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR / Rs.) *</label>
                  <input 
                    type="number" 
                    step="1" 
                    required 
                    placeholder="2500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="100"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white"
                >
                  <option value="Treacle">Treacle (කිතුල් පැණි)</option>
                  <option value="Jaggery">Jaggery (කිතුල් හකුරු)</option>
                  <option value="Toffee">Toffee (කිතුල් ටොෆි)</option>
                  <option value="Dessert Syrup">Dessert Syrup (කිතුල් සිරප්)</option>
                  <option value="Kithul Flour">Kithul Flour (කිතුල් පිටි)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe your authentic Sri Lankan Kithul product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input 
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  Mark as Bestseller ⭐
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input 
                    type="checkbox"
                    checked={formData.is_organic}
                    onChange={(e) => setFormData({ ...formData, is_organic: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  Certified Organic 🌿
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {formSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;