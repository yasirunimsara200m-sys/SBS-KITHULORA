import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, Grid, List, Search, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';

const Shop: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { name: 'All', label: 'All (සියල්ල)', emoji: '🍯' },
    { name: 'Treacle', label: 'Treacle (කිතුල් පැණි)', emoji: '🏺' },
    { name: 'Jaggery', label: 'Jaggery (කිතුල් හකුරු)', emoji: '🟤' },
    { name: 'Toffee', label: 'Toffee (කිතුල් ටොෆි)', emoji: '🍬' },
    { name: 'Dessert Syrup', label: 'Dessert Syrup (කිතුල් සිරප්)', emoji: '🥞' },
    { name: 'Kithul Flour', label: 'Kithul Flour (කිතුල් පිටි)', emoji: '🌾' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getAll({
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: search || undefined,
        sort: sort || undefined,
      });
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load products. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-orange-50/20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 py-16 px-4 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="container mx-auto text-center relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> 100% Raw Forest Harvest
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">SBS KITHULORA</h1>
          <p className="text-amber-200 text-base sm:text-lg font-bold tracking-wider uppercase mb-2">
            Pure Kithul. Pure Sri Lanka.
          </p>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Authentic single-origin organic Ceylon Kithul Treacle, Jaggery, Toffees, Dessert Syrups, and traditional Flour.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        
        {/* Filters and Controls */}
        <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-5 mb-8 border border-amber-100/70 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.name
                      ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-amber-50 border border-gray-100'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label || cat.name}</span>
                </button>
              ))}
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="relative min-w-[180px] sm:min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search honey..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </form>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Results Counter */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              Showing <strong className="text-gray-800 font-bold">{products.length}</strong> items in <span className="text-amber-700 font-bold">{activeCategory}</span>
            </span>
            <span className="text-green-700 font-medium">✓ In Stock & Ready to Ship</span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-base">{error}</p>
            <button onClick={fetchProducts} className="mt-3 text-sm font-bold text-amber-600 hover:underline">
              Try Again
            </button>
          </div>
        )}

        {/* Empty Catalog State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-amber-100 shadow-sm max-w-md mx-auto">
            <span className="text-5xl block mb-3">🍯</span>
            <h3 className="text-xl font-bold text-gray-800">No Products Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try switching categories or clearing search keywords.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearch(''); }}
              className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full font-semibold text-xs shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {products.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;