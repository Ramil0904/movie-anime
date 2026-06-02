import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button onClick={scrollToTop} style={{ position: 'fixed', bottom: '30px', right: '30px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 99, transition: '0.3s' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      ▲
    </button>
  );
}