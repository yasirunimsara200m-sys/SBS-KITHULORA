// components/BackToTopButton.tsx
import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-full shadow-lg
        bg-gradient-to-br from-amber-500 to-orange-600
        text-white flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-xl hover:from-amber-400 hover:to-orange-500
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
};

export default BackToTopButton;
