import React from 'react';

export default function Sidebar({ contentType, selectedGenre, setSelectedGenre, setPage, customGenres = [] }) {
  
  if (contentType === 'favorites' || contentType === 'all' || customGenres.length === 0) {
    return null;
  }

  return (
    <aside style={{ 
      width: '240px', 
      minWidth: '240px', 
      background: '#111111', 
      padding: '40px 20px', 
      boxSizing: 'border-box',
      borderRight: '1px solid #222',
      height: '100%', 
      overflowY: 'auto'
    }}>
      <h3 style={{ 
        color: '#ffffff', 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '20px', 
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        ЖАНРЫ
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => { setSelectedGenre(null); setPage(1); }}
          style={{
            textAlign: 'left',
            padding: '10px 15px',
            background: selectedGenre === null ? '#E50914' : 'transparent',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: '0.2s'
          }}
        >
          Все жанры
        </button>

        {customGenres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => { setSelectedGenre(genre.id); setPage(1); }}
            style={{
              textAlign: 'left',
              padding: '10px 15px',
              background: selectedGenre === genre.id ? '#E50914' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: selectedGenre === genre.id ? 'bold' : 'normal',
              fontSize: '14px',
              transition: '0.2s'
            }}
            onMouseOver={(e) => { if(selectedGenre !== genre.id) e.target.style.background = '#222'; }}
            onMouseLeave={(e) => { if(selectedGenre !== genre.id) e.target.style.background = 'transparent'; }}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </aside>
  );
}