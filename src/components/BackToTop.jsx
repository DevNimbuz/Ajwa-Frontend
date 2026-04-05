'use client';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="back-to-top"
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
      <style jsx>{`
        .back-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          width: 50px;
          height: 50px;
          background: var(--gradient-gold);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          border: none;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        .back-to-top:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
          filter: brightness(1.1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          bottom: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
        }
      `}</style>
    </button>
  );
}
