// Footer.tsx
import React from 'react';
import { Globe, MessageCircle, Camera, Video, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-white p-0.5 shrink-0">
                <img src="/icon.jpg" alt="SBS KITHULORA Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">SBS <span className="text-amber-500">KITHULORA</span></span>
                <p className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">Pure Kithul. Pure Sri Lanka.</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              100% Pure, authentic organic Ceylon Kithul treacle, jaggery, toffees, and traditional palm flour direct from Sri Lankan rainforests.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-amber-500 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-amber-500 transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-amber-500 transition-colors"><Camera className="w-5 h-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-amber-500 transition-colors"><Video className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="hover:text-amber-500 transition-colors">Shop All</a></li>
              <li><a href="/about" className="hover:text-amber-500 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-amber-500 transition-colors">Contact</a></li>
              <li><a href="/blog" className="hover:text-amber-500 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Pure Honey</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Organic Honey</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Infused Honey</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Gift Sets</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">No.137, "Buddhinim", ViskamUyana, Warakapitiya, Denipitiya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="tel:0764625276" className="hover:text-amber-400 transition-colors">076 462 5276</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <a 
                  href="https://wa.me/94764625276?text=Hello%20SBS%20KITHULORA%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  WhatsApp: 076 462 5276
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="mailto:info@sbskithulora.com" className="hover:text-amber-400 transition-colors">info@sbskithulora.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm">
          <p>© {new Date().getFullYear()} SBS KITHULORA. Pure Kithul. Pure Sri Lanka. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;