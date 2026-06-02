import './Header.css'; 

export default function Header({ 
  contentType, 
  handleTypeChange, 
  searchQuery, 
  setSearchQuery, 
  currentUser,    
  onAuthClick,   
  onLogout       
}) {
  
  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'movie', label: 'Фильмы' },
    { id: 'tv', label: 'Сериалы' },
    { id: 'cartoon', label: 'Мультфильмы' },
    { id: 'anime', label: 'Аниме' },
    { id: 'actors', label: 'Актеры' },
    { id: 'favorites', label: 'Избранное' },
  ];

  return (
    <header className="site-header" style={{ position: 'relative' }}>
      <div className="header-top-row">
        <div className="header-logo" onClick={() => handleTypeChange('all')}>
          Movie <span style={{ color: '#E50914' }}>&</span> Anime
        </div>
        
        <div className="header-search-box">
          <input
            type="text"
            placeholder="Поиск контента..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
        </div>

        <div className="header-auth-block">
          {currentUser ? (
            <div className="header-user-menu">
              <span className="header-username"> {currentUser.username}</span>
              <button onClick={onLogout} className="header-logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="header-login-btn">
              Войти
            </button>
          )}
        </div>
      </div>

      <nav className="header-categories-nav">
        {categories.map((cat) => {
          const isFav = cat.id === 'favorites';
          const isActors = cat.id === 'actors';
          
          let buttonClass = 'category-nav-btn';
          if (contentType === cat.id) buttonClass += ' active';
          if (isFav) buttonClass += ' favorites-btn';
          if (isActors) buttonClass += ' actors-btn';

          return (
            <button
              key={cat.id}
              onClick={() => handleTypeChange(cat.id)}
              className={buttonClass}
            >
              {isFav ? `♥ ${cat.label}` : cat.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}