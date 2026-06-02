import React, { useRef } from 'react';
import MovieCard from './MovieCard';

export default function MovieCarousel({ title, items, favorites, toggleFavorite, onCardClick }) {
  const carouselRef = useRef(null);

  if (!items || items.length === 0) return null;

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ marginTop: '35px', marginBottom: '15px', padding: '0 5px', position: 'relative' }}>
      <h3 style={{ 
        fontSize: '22px', 
        color: '#ffb703', 
        marginBottom: '10px', 
        fontWeight: 'bold',
        textAlign: 'left' 
      }}>
        {title}
      </h3>
      
      <div style={{ position: 'relative' }}>
        
        <button 
          onClick={() => scroll('left')}
          className="carousel-arrow-btn left"
          style={{
            position: 'absolute',
            left: '-15px',
            top: '40%', 
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(15, 15, 15, 0.85)',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '4px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
          }}
          onMouseEnter={(e) => { e.target.style.background = '#E50914'; e.target.style.borderColor = '#E50914'; }}
          onMouseLeave={(e) => { e.target.style.background = 'rgba(15, 15, 15, 0.85)'; e.target.style.borderColor = '#333'; }}
        >
          ‹
        </button>

        <div 
          ref={carouselRef}
          className="carousel-scroll-container" 
          style={{ 
            display: 'flex', 
            gap: '20px', 
            overflowX: 'auto', 
            padding: '5px 5px 15px 5px',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {items.map(item => (
            <div key={item.id} style={{ minWidth: '160px', maxWidth: '160px', flexShrink: 0 }}>
              <MovieCard 
                item={item} 
                favorites={favorites} 
                toggleFavorite={toggleFavorite} 
                onClick={() => onCardClick(item)} 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="carousel-arrow-btn right"
          style={{
            position: 'absolute',
            right: '-15px',
            top: '40%', 
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(15, 15, 15, 0.85)',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '4px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
          }}
          onMouseEnter={(e) => { e.target.style.background = '#E50914'; e.target.style.borderColor = '#E50914'; }}
          onMouseLeave={(e) => { e.target.style.background = 'rgba(15, 15, 15, 0.85)'; e.target.style.borderColor = '#333'; }}
        >
          ›
        </button>

      </div>
    </div>
  );
}