import React from 'react';
// Импортируем иконки сердечек: пустое (Reg) и залитое (Fill)
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function MovieCard({ item, favorites, toggleFavorite, onClick }) {
  const isFavorite = favorites ? favorites.some(fav => fav.id === item.id) : false;

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#181818',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #222',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '150%', overflow: 'hidden' }}>
        <img 
          src={item.image} 
          alt={item.title} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <button 
          onClick={(e) => { 
            e.stopPropagation();
            toggleFavorite(item); 
          }}
          style={{
            position: 'absolute', 
            top: '10px', 
            right: '10px',
            background: 'rgba(0, 0, 0, 0.6)', // Немного уменьшили прозрачность для стиля
            backdropFilter: 'blur(4px)',      // Добавили красивое размытие заднего фона
            border: 'none', 
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
          }}
        >
          {isFavorite ? (
            /* Залитое красное сердечко, если фильм в избранном */
            <AiFillHeart size={20} color="#e63946" style={{ transition: 'transform 0.2s' }} />
          ) : (
            /* Контурное белое сердечко, если фильма нет в избранном */
            <AiOutlineHeart size={20} color="#fff" style={{ transition: 'transform 0.2s' }} />
          )}
        </button>
      </div>

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '15px', 
          color: '#fff', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          minHeight: '36px', 
          lineHeight: '1.2' 
        }}>
          {item.title}
        </h4>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '13px', color: '#ffb703', fontWeight: 'bold' }}>
            ★ {item.rating}
          </span>
          <span style={{ fontSize: '13px', color: '#888' }}>
            Год: {item.year}
          </span>
        </div>
      </div>
    </div>
  );
}
