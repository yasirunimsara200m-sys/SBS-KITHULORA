import React, { useState, useEffect } from 'react';
import { Star, Trash2, ArrowLeft, Search, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviewService, Review } from '../../services/reviewService';

const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAll();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    setDeletingId(reviewId);
    try {
      await reviewService.delete(reviewId);
      setReviews(reviews.filter(r => r.review_id !== reviewId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = 
      (r.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.product_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesRating = ratingFilter === 'All' || String(r.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 md:p-8">
      <div className="container mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/admin" className="hover:text-amber-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </Link>
          <span>/</span>
          <span className="text-amber-600 font-semibold">Manage Customer Reviews</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-amber-600" /> Customer Reviews
            </h1>
            <p className="text-gray-500 mt-1">Review feedback, monitor ratings, and moderate customer comments</p>
          </div>
          <button 
            onClick={fetchReviews}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm shadow-sm"
          >
            Refresh Reviews
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, product, or review text..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 text-sm shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', '5', '4', '3', '2', '1'].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  ratingFilter === r 
                    ? 'bg-amber-500 text-white shadow' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-amber-50'
                }`}
              >
                {r === 'All' ? 'All Ratings' : `★ ${r} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Review Cards List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-bold text-gray-700">No customer reviews found</p>
            <p className="text-sm mt-1">When customers submit ratings on products, they will appear here for moderation.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((rev) => (
              <div
                key={rev.review_id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {rev.product_image ? (
                    <img
                      src={rev.product_image}
                      alt={rev.product_title}
                      className="w-16 h-16 rounded-xl object-cover border border-amber-100 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl shrink-0">
                      🍯
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-base">{rev.product_title || `Product #${rev.product_id}`}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-700">{rev.rating} / 5</span>
                      <span className="text-xs text-gray-400">by</span>
                      <span className="text-xs font-semibold text-gray-800">{rev.user_name || 'Customer'}</span>
                      {rev.user_email && <span className="text-xs text-gray-400">({rev.user_email})</span>}
                    </div>

                    <p className="text-sm text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-100 leading-relaxed">
                      "{rev.comment || 'No comment provided'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Link
                    to={`/product/${rev.product_id}`}
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={() => handleDelete(rev.review_id)}
                    disabled={deletingId === rev.review_id}
                    className="p-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors disabled:opacity-50"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageReviews;
