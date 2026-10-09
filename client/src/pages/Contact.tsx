// src/pages/Contact.tsx
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: 'No.137, "Buddhinim", ViskamUyana, Warakapitiya, Denipitiya',
      sub: 'Open Monday - Saturday, 8 AM - 6 PM'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-emerald-600" />,
      title: 'WhatsApp Us',
      details: '076 462 5276',
      sub: 'Chat with us directly on WhatsApp (24/7)',
      link: 'https://wa.me/94764625276?text=Hello%20Kithul%20Honey%2C%20I%20would%20like%20to%20place%20an%20order.'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: '076 462 5276',
      sub: '+94 76 462 5276 (Mobile / Hotline)',
      link: 'tel:0764625276'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: 'info@kithulhoney.com',
      sub: 'sbskithul@gmail.com',
      link: 'mailto:info@kithulhoney.com'
    }
  ];

  const faqs = [
    {
      question: 'What is Kithul honey?',
      answer: 'Kithul honey, also known as "Kithul Pani," is a natural sweetener harvested from the flowers of the Kithul palm tree (Caryota urens) native to Sri Lanka. It has a unique caramel-like flavor and is rich in antioxidants.'
    },
    {
      question: 'Is your honey 100% pure?',
      answer: 'Yes! Our Kithul honey is 100% pure with no additives, preservatives, or artificial sweeteners. We test every batch to ensure the highest quality and purity.'
    },
    {
      question: 'How should I store Kithul honey?',
      answer: 'Store your Kithul honey in a cool, dry place away from direct sunlight. It has a long shelf life and does not require refrigeration. If crystallization occurs, simply warm the jar in warm water.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. Please check our shipping policy for more details.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied with your purchase, please contact us and we\'ll make it right.'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit logic here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-200/50">
            <MessageCircle className="w-4 h-4" /> Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Let's Talk
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500"> Kithul</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our honey? We'd love to hear from you. Reach out and
            we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-4 -mt-8 relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const CardContent = (
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl text-amber-600 mb-4">
                      {info.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{info.title}</h3>
                    <p className="text-gray-800 font-medium text-sm leading-snug">{info.details}</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 pt-2 border-t border-gray-100">{info.sub}</p>
                </div>
              );

              return (info as any).link ? (
                <a 
                  key={index} 
                  href={(info as any).link} 
                  target={(info as any).link.startsWith('http') ? '_blank' : undefined} 
                  rel="noopener noreferrer"
                  className="block h-full cursor-pointer"
                >
                  {CardContent}
                </a>
              ) : (
                <div key={index} className="h-full">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-500">
                  We'll get back to you within 24 hours
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all ${
                      errors.name ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all ${
                      errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none ${
                      errors.message ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Tell us how we can help..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Map & Social */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">Find Us</h3>
                </div>
                <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-gray-800 font-medium">No.137, "Buddhinim", ViskamUyana</p>
                    <p className="text-gray-600 text-sm">Warakapitiya, Denipitiya, Sri Lanka</p>
                    <a
                      href="https://maps.google.com/?q=Denipitiya+Sri+Lanka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-all hover:shadow-md group">
                    <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <span className="w-5 h-5 flex items-center justify-center font-bold">f</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Facebook</p>
                      <p className="text-xs text-gray-500">Follow us</p>
                    </div>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-all hover:shadow-md group">
                    <div className="p-2 bg-sky-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <span className="w-5 h-5 flex items-center justify-center font-bold">𝕏</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Twitter</p>
                      <p className="text-xs text-gray-500">Follow us</p>
                    </div>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-all hover:shadow-md group">
                    <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <span className="w-5 h-5 flex items-center justify-center font-bold">◎</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Instagram</p>
                      <p className="text-xs text-gray-500">Follow us</p>
                    </div>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-all hover:shadow-md group">
                    <div className="p-2 bg-red-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <span className="w-5 h-5 flex items-center justify-center font-bold">▶</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">YouTube</p>
                      <p className="text-xs text-gray-500">Subscribe</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 md:py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Find answers to common questions about our Kithul honey
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-amber-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-r from-amber-600 to-orange-500">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience <br className="sm:hidden" /> Pure Kithul Honey?
          </h2>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto mb-8">
            Visit our shop and discover nature's sweetest gift
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3.5 bg-white text-amber-600 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
              Shop Now
            </button>
            <button className="px-8 py-3.5 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all">
              View Products
            </button>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Contact;