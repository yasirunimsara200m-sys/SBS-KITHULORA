import React from 'react';
import { 
  Leaf, 
  Award, 
  Users, 
  Heart, 
  Shield, 
  CheckCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "100% Forest Pure",
      description: "Harvested directly from wild Caryota urens palms without any additives, cane sugar, or chemicals."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Lab Certified Grade A",
      description: "Each harvest batch undergoes rigorous purity testing to ensure the highest natural mineral profile."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Farmer Empowerment",
      description: "Direct fair-trade partnerships with 40+ traditional tapping families in the Sabaragamuwa region."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Eco-Harvesting",
      description: "Sustainable extraction techniques that preserve the natural lifespan of ancient rainforest trees."
    }
  ];

  const milestones = [
    { year: '2019', title: 'The Rainforest Origin', description: 'Began with 5 traditional tree-tappers in the foothills of Sinharaja.' },
    { year: '2021', title: 'Direct-to-Home Purity', description: 'Eliminated middlemen, delivering fresh tapped treacle straight to consumers.' },
    { year: '2023', title: 'Organic Certification', description: 'Awarded 100% natural, preservative-free quality standard recognition.' },
    { year: '2024+', title: 'Island-Wide Trust', description: 'Delivering Ceylon’s golden nectar to thousands of homes & leading restaurants.' }
  ];

  const team = [
    { name: 'Saman Jayathilake', role: 'Master Tree-Tapper & Forager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { name: 'Chamari Silva', role: 'Purity & Quality Assurance', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
    { name: 'Nimal Bandara', role: 'Sustainable Forest Operations', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
    { name: 'Dr. K. Ranasinghe', role: 'Botanical & Nutritional Advisor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-6 border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600" /> Preserving Ancient Ceylon Wisdom
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              SBS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600">
                KITHULORA
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-800 block mt-2">
                Pure Kithul. Pure Sri Lanka.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              From the mystical misty rain forest canopies of Sri Lanka, we deliver the pristine taste of wild Kithul treacle — completely raw, pure, and untouched by industrial chemicals.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="px-4 py-16 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
                Our Roots
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-6">
                From 40-Foot Palms Straight to Your Dining Table
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                Kithul syrup (Pani) is derived from the inflorescence flower of the wild Caryota urens palm. For centuries in ancient Ceylon, royalty savored this natural sweetener alongside creamy buffalo curd.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                Unlike mass-market alternatives adulterated with brown sugar, we slow-simmer genuine forest nectar over wood fires in traditional open clay kettles until it reaches its signature caramelized amber glow.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full text-green-700">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">100% Single-Origin Sabaragamuwa Harvest</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full text-green-700">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Low Glycemic Index (Healthy Sugar Alternative)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full text-green-700">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Supports Local Village Ecosystems</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80" 
                  alt="Sri Lanka Rain Forest" 
                  className="rounded-3xl h-64 w-full object-cover shadow-lg" 
                />
                <img 
                  src="/assets/products/kithul-treacle.jpg" 
                  alt="Pure Kithul Treacle Glass Bottle" 
                  className="rounded-3xl h-64 w-full object-cover shadow-lg mt-8" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
              Commitment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Our Guiding Principles
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">
              We pledge to honor nature and deliver uncompromising purity in every single bottle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100/60 text-center">
                <div className="inline-flex p-3 bg-amber-100 text-amber-700 rounded-2xl mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="px-4 py-16 bg-white/60">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
              Growth
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Our Journey So Far
            </h2>
          </div>
          
          <div className="space-y-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex gap-5 items-start bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md flex-shrink-0">
                  {m.year}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{m.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Community */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
              People
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Meet the Keepers of the Tradition
            </h2>
            <p className="text-gray-500 text-sm mt-1">Dedicated guardians of Sri Lanka's finest natural syrup</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-center border border-gray-100">
                <img src={t.image} alt={t.name} className="w-full h-52 object-cover" />
                <div className="p-5">
                  <h4 className="font-bold text-gray-900 text-base">{t.name}</h4>
                  <p className="text-amber-600 text-xs font-medium mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Experience Nature’s Purest Sweetness
          </h2>
          <p className="text-amber-100 text-sm sm:text-base mb-8 leading-relaxed">
            Order authentic Ceylon Kithul honey today and taste the difference of raw, unadulterated forest harvest.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate('/shop')} 
              className="px-8 py-3.5 bg-white text-amber-700 rounded-full font-bold shadow-lg hover:bg-amber-50 transition-all text-sm flex items-center gap-2"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="px-8 py-3.5 bg-amber-800/40 border border-white/30 text-white rounded-full font-bold hover:bg-amber-800/60 transition-all text-sm"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;