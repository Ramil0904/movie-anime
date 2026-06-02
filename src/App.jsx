import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movie_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movie_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isExist = prev.some(fav => fav.id === item.id);
      if (isExist) {
        return prev.filter(fav => fav.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <div style={{ background: '#111111', minHeight: '100vh', color: '#ffffff' }}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage favorites={favorites} toggleFavorite={toggleFavorite} />} 
          />
        </Routes>
      </Router>
    </div>
  );
}