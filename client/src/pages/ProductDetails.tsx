import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, Minus, Plus, Heart, Share2, Truck, Shield, Leaf,
  ChevronLeft, ChevronRight, ShoppingCart, Zap, Award, CheckCircle, Package,
  MessageSquare, Send, ThumbsUp, MessageCircle
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService, Review } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  // Customer Reviews State
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      setAddedNotice(false);
      setQuantity(1);
      productService.getById(id)
        .then(data => setProduct(data.product))
        .catch(() => setError('Failed to load product details.'))
        .finally(() => setLoading(false));

      // fetch related products
      productService.getAll({ limit: 10 })
        .then(data => {
          const all = data.products || [];
          setRelated(all.filter((p: any) => String(p.product_id) !== String(id)));
        })
        .catch(() => {});

      // fetch live customer reviews
      setLoadingReviews(true);
      reviewService.getByProduct(id)
        .then(data => setReviewsList(data.reviews || []))
        .catch(() => {})
        .finally(() => setLoadingReviews(false));
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    if (!newComment.trim()) {
      setReviewError('Please write your thoughts in the review box.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await reviewService.create(id, { rating: newRating, comment: newComment.trim() });
      setReviewsList(prev => [res.review, ...prev]);
      if (res.updatedProduct) {
        setProduct((p: any) => ({
          ...p,
          rating: res.updatedProduct.rating,
          reviews: res.updatedProduct.reviews
        }));
      }
      setNewComment('');
      setReviewSuccess('Your review has been submitted successfully! Thank you for sharing your feedback. 🍯');
      setTimeout(() => setReviewSuccess(''), 5000);
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product.product_id, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product.product_id, quantity);
      navigate('/checkout');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to proceed to checkout.');
    }
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/40">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <p className="text-amber-700 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-700">{error || 'Product not found.'}</p>
        <Link to="/shop" className="px-6 py-2.5 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-all">
          Back to Shop
        </Link>
      </div>
    );
  }

  const name = product.title;
  const price = Number(product.price);
  const rating = product.rating || 4.9;
  const reviews = product.reviews || 128;
  const image = product.image_url || '/api/placeholder/600/600';
  const description = product.description || 'Experience pure, organic Kithul honey harvested sustainably in Sri Lanka.';
  const stock = product.stock_quantity ?? 100;
  const discount = Math.round(price * 0.15);
  const originalPrice = (price + discount).toFixed(2);

  const reviewList = [
    { name: 'Amali P.', rating: 5, date: '2 days ago', text: 'Absolutely love this honey! So pure and rich in flavour.', avatar: 'A' },
    { name: 'Nuwan S.', rating: 5, date: '1 week ago', text: 'Best Kithul honey I\'ve ever tasted. Will order again!', avatar: 'N' },
    { name: 'Dilani R.', rating: 4, date: '2 weeks ago', text: 'Great quality, fast delivery. Packaging was also excellent.', avatar: 'D' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center gap-1.5 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-amber-600 transition-colors">Home</Link></li>
            <span className="text-gray-300">/</span>
            <li><Link to="/shop" className="hover:text-amber-600 transition-colors">Shop</Link></li>
            <span className="text-gray-300">/</span>
            <li className="text-amber-600 font-medium truncate max-w-xs">{name}</li>
          </ol>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">

        {/* ── Main Product Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="grid lg:grid-cols-2 gap-0">

            {/* Left — Image Panel */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex items-center justify-center min-h-[420px]">
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_bestseller && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow">
                    <Award className="w-3 h-3" /> Best Seller
                  </span>
                )}
                {product.is_organic && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow">
                    🌿 Organic
                  </span>
                )}
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow">
                  15% OFF
                </span>
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow border transition-all ${wishlisted ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-red-200'}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow hover:border-amber-300 transition-all">
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <img
                src={image}
                alt={name}
                className="w-full max-w-sm h-80 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Right — Info Panel */}
            <div className="p-6 lg:p-8 flex flex-col justify-between">
              <div>
                {/* Category tag */}
                {product.category && (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {product.category}
                  </span>
                )}

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-3 leading-snug">{name}</h1>

                {/* Rating row */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{rating}</span>
                  <span className="text-sm text-gray-400">({reviews} reviews)</span>
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> In Stock ({stock})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mt-5">
                  <span className="text-4xl font-bold text-amber-600">{formatPrice(price)}</span>
                  {originalPrice && (
                    <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(Number(originalPrice))}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full mb-1">Save {formatPrice(discount)}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes. Free island-wide delivery on orders over Rs. 10,000.</p>

                {/* Feature Badges */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  <div className="flex flex-col items-center gap-1 p-3 bg-green-50 rounded-xl border border-green-100">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="text-xs text-gray-600 font-medium text-center">100% Pure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-gray-600 font-medium text-center">Certified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Truck className="w-5 h-5 text-orange-600" />
                    <span className="text-xs text-gray-600 font-medium text-center">Fast Delivery</span>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-4 p-3 bg-amber-50 rounded-xl flex items-center gap-3 border border-amber-100">
                  <Package className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">Island-wide Delivery</p>
                    <p className="text-xs text-amber-600">Dispatch from Warakapitiya, Denipitiya within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-800 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors border-l border-gray-200"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: <span className="font-bold text-amber-600">{formatPrice(price * quantity)}</span>
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow hover:bg-gray-800 hover:shadow-lg transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>

                {/* WhatsApp Order Button */}
                <a
                  href={`https://wa.me/94764625276?text=${encodeURIComponent(`Hello! I would like to order: ${product?.title || 'Kithul Product'} (Quantity: ${quantity}, Total: ${formatPrice(price * quantity)}). Store Address: No.137, "Buddhinim", ViskamUyana, Warakapitiya, Denipitiya`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order via WhatsApp (076 462 5276)
                </a>

                {addedNotice && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between animate-pulse-once">
                    <div className="flex items-center gap-2 text-green-800 text-sm font-bold">
                      <span>🍯</span> Successfully added to your cart!
                    </div>
                    <Link to="/cart" className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors">
                      Go to Cart ➜
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100">
            {(['description', 'details', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${reviews})` : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>{description}</p>
                <p>Sourced directly from the lush forests of Sri Lanka, our Kithul honey is hand-harvested by skilled local farmers using traditional methods passed down through generations. Each jar captures the unique, rich flavour of the Kithul palm tree.</p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-4">
                  <li>Raw and unfiltered — preserves all natural enzymes</li>
                  <li>No artificial additives or preservatives</li>
                  <li>Rich in antioxidants and minerals</li>
                  <li>Sustainably harvested — supports local communities</li>
                </ul>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['Origin', 'Sri Lanka'],
                  ['Type', 'Kithul Palm Honey'],
                  ['Category', product.category || 'Natural Honey'],
                  ['Weight', '500g / 1kg options'],
                  ['Shelf Life', '24 months'],
                  ['Storage', 'Store in a cool, dry place'],
                  ['Certifications', 'ISO 22000, Organic Certified'],
                  ['Allergens', 'May contain pollen traces'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2.5 px-4 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 font-medium">{label}</span>
                    <span className="text-sm text-gray-800 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-amber-50/80 rounded-2xl border border-amber-200/60">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-black text-amber-600">{rating}</div>
                    <div className="flex justify-center sm:justify-start mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                      Based on {reviewsList.length > 0 ? reviewsList.length : reviews} verified reviews
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
                    {[5,4,3,2,1].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-2 font-semibold">{s}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <div className="flex-1 bg-amber-100/80 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: s === 5 ? '80%' : s === 4 ? '15%' : s === 3 ? '5%' : '0%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write a Review Section */}
                <div className="p-6 bg-white rounded-2xl border border-amber-200/60 shadow-sm">
                  {user ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-amber-600" /> Write a Customer Review
                        </h3>
                        <span className="text-xs text-gray-400">Reviewing as <strong className="text-gray-700">{user.name}</strong></span>
                      </div>

                      {reviewSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> {reviewSuccess}
                        </div>
                      )}

                      {reviewError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                          {reviewError}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Overall Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setNewRating(star)}
                              className="p-1 hover:scale-125 transition-transform"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  (hoverRating || newRating) >= star
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-200 fill-gray-200'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-xs font-bold text-amber-700">
                            {hoverRating || newRating} / 5 Stars
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Review / Comments</label>
                        <textarea
                          rows={3}
                          required
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Tell us what you liked about this Kithul honey, its taste, aroma, texture, or packaging..."
                          className="w-full p-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-xl text-xs hover:shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-60"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">Have you tasted this Kithul Honey?</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Please sign in to share your review and help other honey lovers.</p>
                      </div>
                      <Link
                        to="/login"
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow transition-all whitespace-nowrap"
                      >
                        Sign in to Review
                      </Link>
                    </div>
                  )}
                </div>

                {/* Review List */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm">Customer Feedback</h3>
                  
                  {loadingReviews ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                      <p className="text-xs text-gray-400 mt-2">Loading reviews...</p>
                    </div>
                  ) : reviewsList.length > 0 ? (
                    reviewsList.map((r) => (
                      <div key={r.review_id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-amber-200 transition-colors shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {r.user_name ? r.user_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 text-sm">{r.user_name || 'Verified Customer'}</span>
                            <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    reviewList.map((r, i) => (
                      <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-amber-200 transition-colors shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {r.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 text-sm">{r.name}</span>
                            <span className="text-xs text-gray-400">{r.date}</span>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products — Daraz-style horizontal scroll ── */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">You May Also Like</h2>
                <p className="text-xs text-gray-400 mt-0.5">More from our collection</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-300 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-300 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-4 p-4 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {related.map((p: any) => {
                const pPrice = Number(p.price);
                const pOrig = (pPrice * 1.15).toFixed(2);
                return (
                  <Link
                    key={p.product_id}
                    to={`/product/${p.product_id}`}
                    className="group shrink-0 w-44 bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative bg-amber-50 h-36 overflow-hidden">
                      <img
                        src={p.image_url || '/api/placeholder/180/180'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {p.is_bestseller && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{p.title}</p>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-600">{p.rating || 4.9}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-amber-600">{formatPrice(pPrice)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(Number(pOrig))}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;