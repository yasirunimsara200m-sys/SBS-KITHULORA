import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  Truck, 
  Shield, 
  Leaf, 
  Award, 
  Clock, 
  Heart,
  Droplet,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    productService.getFeatured()
      .then(data => setFeaturedProducts(data.products || []))
      .catch(() => {});
  }, []);

  const features = [
    { 
      icon: <Leaf className="w-8 h-8" />, 
      title: "100% Wild & Natural", 
      description: "Harvested from wild Caryota urens palms in Sri Lankan rainforests." 
    },
    { 
      icon: <Award className="w-8 h-8" />, 
      title: "Pure & Unadulterated", 
      description: "Zero added sugar, no artificial preservatives, and 100% vegan friendly." 
    },
    { 
      icon: <Truck className="w-8 h-8" />, 
      title: "Island-wide Fast Delivery", 
      description: "Free doorstep delivery across the island on orders over Rs. 10,000." 
    },
    { 
      icon: <Shield className="w-8 h-8" />, 
      title: "Lab Tested Quality", 
      description: "Certified pure grade syrup with high natural antioxidant content." 
    }
  ];

  const testimonials = [
    {
      name: "Dr. Anura Senanayake",
      role: "Verified Buyer",
      comment: "The taste is indistinguishable from the traditional Kithul treacle my grandmother used to serve with curd. Absolutely authentic and rich!",
      rating: 5
    },
    {
      name: "Michelle Vandort",
      role: "Baker & Chef",
      comment: "I use this Kithul honey for all my gourmet desserts. The caramel aroma and smooth consistency is simply world class.",
      rating: 5
    },
    {
      name: "Kasun Jayasuriya",
      role: "Fitness Enthusiast",
      comment: "A superb healthy natural sweetener with low glycemic index. Replaced refined white sugar in my tea and oats forever.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-orange-50/20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40" />
        
        {/* Glow Spheres */}
        <div className="absolute top-16 right-10 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Hero Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 border border-amber-300/60 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>SBS KITHULORA • 100% Pure Ceylon Kithul</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                SBS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600">KITHULORA</span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-800 block mt-2">
                  Pure Kithul. Pure Sri Lanka.
                </span>
              </h1>
              
              <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Extracted sustainably from wild rainforest Kithul blossoms. Rich in minerals, naturally low glycemic, and brimming with rich caramel sweetness.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/shop')} 
                  className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-base shadow-lg shadow-orange-500/20"
                >
                  Explore Collection 🍯
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/about')} 
                  className="px-8 py-4 bg-white text-gray-800 rounded-full font-bold border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-300 shadow-sm text-base"
                >
                  Our Heritage
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-6 border-t border-amber-200/50">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800 text-sm">4.9/5</span>
                  <span className="text-gray-500 text-xs">(1,200+ Verified Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>ISO Certified</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span>100% Vegan</span>
                </div>
              </div>
            </div>
            
            {/* Right Hero Visual */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6 transform hover:scale-105 transition-all duration-500">
                  <img 
                    src="/icon.jpg" 
                    alt="Pure Sri Lankan Kithul Honey Dripping" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                
                {/* Floating Badge Top Right */}
                <div className="absolute -top-5 -right-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-amber-100 animate-bounce-slow">
                  <div className="bg-amber-100 rounded-xl p-2.5 text-amber-700">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Grade A Certified</div>
                    <div className="text-xs text-gray-500">Traditional Harvest</div>
                  </div>
                </div>
                
                {/* Floating Badge Bottom Left */}
                <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-amber-100">
                  <div className="bg-green-100 rounded-xl p-2.5 text-green-700">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Zero Added Sugar</div>
                    <div className="text-xs text-gray-500">Pure Unadulterated</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="px-4 py-16 bg-white/80 backdrop-blur-sm border-t border-b border-amber-100/60">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
              Why Kithul Honey
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">The Purest Taste of Nature</h2>
            <p className="text-gray-500 text-sm mt-2">Crafted with care following century-old island traditions</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-amber-100/50 group"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl text-amber-700 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
                Featured Selection
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Bestselling Varieties</h2>
              <p className="text-gray-500 mt-1 text-sm">Finest batches handpicked for true honey connoisseurs</p>
            </div>
            <button 
              onClick={() => navigate('/shop')} 
              className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1.5 group transition-colors text-sm"
            >
              View Full Collection 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(p => (
                <ProductCard key={p.product_id} product={p} />
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <ProductCard key={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Heritage Story Banner */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-amber-900 to-orange-900 rounded-3xl p-8 md:p-14 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Traditional Heritage
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-4 leading-tight">
                  Handcrafted from the Rainforests of Ceylon
                </h2>
                <p className="text-amber-100 text-sm sm:text-base mt-4 leading-relaxed">
                  Our tree-tappers climb heights of over 40 feet in the dense canopies of Sinharaja to collect fresh nectar drop by drop at dawn. Slowly boiled over wood-fires in earthen hearths to yield an intoxicatingly deep, velvety syrup.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-amber-200">
                    <CheckCircle className="w-5 h-5 text-amber-400" />
                    <span>Fair-Trade to Village Farmers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-200">
                    <CheckCircle className="w-5 h-5 text-amber-400" />
                    <span>Eco-Friendly Glass Bottling</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link 
                    to="/about"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-full font-bold text-sm transition-all"
                  >
                    Read Our Full Story <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/assets/products/kithul-treacle.jpg" 
                  alt="Pure Kithul Treacle Glass Bottle" 
                  className="rounded-2xl h-48 w-full object-cover shadow-lg"
                />
                <img 
                  src="/assets/products/kithul-jaggery.jpg" 
                  alt="Authentic Kithul Jaggery" 
                  className="rounded-2xl h-48 w-full object-cover shadow-lg mt-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="px-4 py-16 bg-amber-50/40">
        <div className="container mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
              Customer Love
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Loved Across Sri Lanka</h2>
            <p className="text-gray-500 text-sm mt-1">Read what authentic home cooks and health lovers say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-green-600 font-medium">✓ {t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Promo Callout */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold">Enjoy 10% Off Your First Order!</h3>
            <p className="text-amber-100 text-sm sm:text-base mt-2 max-w-lg mx-auto">
              Subscribe to our harvest newsletter for exclusive discount codes, recipe ideas, and limited reserve batch releases.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email..." 
                className="px-5 py-3 rounded-full text-sm text-gray-800 outline-none w-full bg-white"
              />
              <button 
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-full text-sm shadow-md transition-all whitespace-nowrap"
              >
                Claim 10% Off
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;