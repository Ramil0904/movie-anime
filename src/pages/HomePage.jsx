import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import ScrollToTop from '../components/ScrollToTop';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';
import DetailsModal from './../components/modals/DetailsModal';
import AuthModal from './../components/modals/AuthModal';
import ActorModal from '../components/modals/ActorModal'; 
import MovieCarousel from '../components/MovieCarousel';
import './HomePage.css'; 

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export default function HomePage({ favorites, toggleFavorite }) {
  const [content, setContent] = useState([]);
  const [contentType, setContentType] = useState('all'); 
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null); 
  const [trailerKey, setTrailerKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [modalCast, setModalCast] = useState([]);
  const [comments, setComments] = useState({}); 
  const [newCommentText, setNewCommentText] = useState(''); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const movieGenres = [
    { id: 28, name: 'Боевики' },
    { id: 35, name: 'Комедии' },
    { id: 18, name: 'Драмы' },
    { id: 14, name: 'Фэнтези' },
    { id: 27, name: 'Ужасы' },
  ];

  const tvGenres = [
    { id: 10759, name: 'Боевики и Приключения' },
    { id: 35, name: 'Комедии' },
    { id: 18, name: 'Драмы' },
    { id: 9648, name: 'Детективы' }, 
    { id: 10765, name: 'Фантастика и Фэнтези' },
  ];

  const cartoonGenres = [
    { id: 10751, name: 'Семейные' },
    { id: 35, name: 'Комедии' },
    { id: 14, name: 'Фэнтези' },
    { id: 12, name: 'Приключения' },
  ];

  const animeGenres = [
    { id: 1, name: 'Экшен' },
    { id: 4, name: 'Комедия' },
    { id: 10, name: 'Фэнтези' },
    { id: 22, name: 'Романтика' },
  ];

  useEffect(() => {
    const savedComments = localStorage.getItem('movie_comments');
    if (savedComments) setComments(JSON.parse(savedComments));

    const activeUser = localStorage.getItem('active_user');
    if (activeUser) setCurrentUser(JSON.parse(activeUser));

    fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`)
      .then(res => res.json())
      .then(data => {
        const items = (data.results || []).slice(0, 16).map(item => ({
          id: `top-movie-${item.id}`, realId: item.id, title: item.title, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%D0%B0',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.release_date?.substring(0, 4) || '—', type: 'movie', overview: item.overview
        }));
        setTopRated(items);
      }).catch(err => console.error("Ошибка загрузки лучших фильмов:", err));

    fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`)
      .then(res => res.json())
      .then(data => {
        const items = (data.results || []).slice(0, 16).map(item => ({
          id: `upcoming-movie-${item.id}`, realId: item.id, title: item.title, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%D0%B0',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.release_date?.substring(0, 4) || '—', type: 'movie', overview: item.overview
        }));
        setUpcoming(items);
      }).catch(err => console.error("Ошибка загрузки ожидаемых фильмов:", err));
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authUsername.trim() || !authPassword.trim()) {
      setAuthError('Заполните все поля!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('site_users') || '[]');

    if (authMode === 'register') {
      const userExists = users.some(u => u.username.toLowerCase() === authUsername.toLowerCase());
      if (userExists) {
        setAuthError('Пользователь с таким именем уже существует!');
        return;
      }

      const newUser = { username: authUsername, password: authPassword };
      users.push(newUser);
      localStorage.setItem('site_users', JSON.stringify(users));
      localStorage.setItem('active_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      closeAuthModal();
    } else {
      const user = users.find(u => u.username.toLowerCase() === authUsername.toLowerCase() && u.password === authPassword);
      if (!user) {
        setAuthError('Неверное имя пользователя или пароль!');
        return;
      }

      localStorage.setItem('active_user', JSON.stringify(user));
      setCurrentUser(user);
      closeAuthModal();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('active_user');
    setCurrentUser(null);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthUsername('');
    setAuthPassword('');
    setAuthError('');
  };

  const getCurrentGenres = () => {
    if (contentType === 'favorites' || contentType === 'actors') return []; 
    if (contentType === 'movie') return movieGenres;
    if (contentType === 'tv') return tvGenres;
    if (contentType === 'cartoon') return cartoonGenres;
    if (contentType === 'anime') return animeGenres;
    return [];
  };

  const handleContentTypeChange = (type) => {
    if (contentType === type && page === 1 && selectedGenre === null) return;
    setContent([]);
    setSelectedGenre(null);
    setPage(1);
    setHasMore(true);
    setContentType(type);
    setIsSidebarOpen(false); 
  };

  const handleGenreChange = (genreId) => {
    if (selectedGenre === genreId && page === 1) return;
    setContent([]);
    setPage(1);
    setHasMore(true);
    setSelectedGenre(genreId);
    setIsSidebarOpen(false); 
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    let isCurrentRequest = true;

    if (contentType === 'favorites') {
      setContent(favorites);
      setHasMore(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const isSearch = debouncedSearch.trim() !== '';

    if (contentType === 'all') {
      const movieUrl1 = isSearch
        ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page}`
        : `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page}`;
      
      const movieUrl2 = isSearch
        ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page + 1}`
        : `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page + 1}`;

      const tvUrl1 = isSearch
        ? `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page}`
        : `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page}`;
        
      const tvUrl2 = isSearch
        ? `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page + 1}`
        : `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page + 1}`;

      Promise.all([
        fetch(movieUrl1).then(res => res.json()).catch(() => ({ results: [] })),
        fetch(movieUrl2).then(res => res.json()).catch(() => ({ results: [] })),
        fetch(tvUrl1).then(res => res.json()).catch(() => ({ results: [] })),
        fetch(tvUrl2).then(res => res.json()).catch(() => ({ results: [] }))
      ]).then(([m1, m2, t1, t2]) => {
        if (!isCurrentRequest) return; 

        const allMovies = [...(m1.results || []), ...(m2.results || [])];
        const allTvs = [...(t1.results || []), ...(t2.results || [])];

        const normMovies = allMovies.map(item => ({
          id: `movie-${item.id}`, realId: item.id, title: item.title, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%Dpostera',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.release_date?.substring(0,4) || '—', type: 'movie', overview: item.overview
        }));

        const normTvs = allTvs.map(item => ({
          id: `tv-${item.id}`, realId: item.id, title: item.name, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%Dpostera',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.first_air_date?.substring(0,4) || '—', type: 'tv', overview: item.overview
        }));

        let combined = [];
        const maxLength = Math.max(normMovies.length, normTvs.length);
        for (let i = 0; i < maxLength; i++) {
          if (normMovies[i]) combined.push(normMovies[i]);
          if (normTvs[i]) combined.push(normTvs[i]);
        }

        const finalContent = combined.slice(0, 21);
        
        setContent(finalContent);
        setHasMore(combined.length > 21);
        setLoading(false);
      }).catch(() => { 
        if (isCurrentRequest) { setLoading(false); setHasMore(false); }
      });
    }
    else if (contentType === 'movie') {
      let url = isSearch 
        ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page}`
        : `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&without_genres=16&language=ru-RU&page=${page}${selectedGenre ? `&with_genres=${selectedGenre}` : ''}`;

      fetch(url).then(res => res.json()).then(data => {
        if (!isCurrentRequest) return;
        const items = (data.results || []).map(item => ({
          id: item.id, realId: item.id, title: item.title, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%Dpostera',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.release_date?.substring(0, 4) || '—', type: 'movie', overview: item.overview
        }));
        
        const slicedItems = items.slice(0, 18);
        setContent(slicedItems);
        setHasMore(items.length > 18 || (data.page < data.total_pages));
        setLoading(false);
      }).catch(() => { if (isCurrentRequest) { setLoading(false); setHasMore(false); } });
    } 

    else if (contentType === 'tv') {
      let url = isSearch
        ? `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page}`
        : `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&without_genres=16&language=ru-RU&page=${page}${selectedGenre ? `&with_genres=${selectedGenre}` : ''}`;

      fetch(url).then(res => res.json()).then(data => {
        if (!isCurrentRequest) return;
        const items = (data.results || []).map(item => ({
          id: item.id, realId: item.id, title: item.name, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%Dpostera',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.first_air_date?.substring(0, 4) || '—', type: 'tv', overview: item.overview
        }));

        const slicedItems = items.slice(0, 18);
        setContent(slicedItems);
        setHasMore(items.length > 18 || (data.page < data.total_pages));
        setLoading(false);
      }).catch(() => { if (isCurrentRequest) { setLoading(false); setHasMore(false); } });
    } 

    else if (contentType === 'cartoon') {
      const genresParam = selectedGenre ? `16,${selectedGenre}` : '16';
      let url = isSearch
        ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page}`
        : `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genresParam}&language=ru-RU&page=${page}`;

      fetch(url).then(res => res.json()).then(data => {
        if (!isCurrentRequest) return;
        let items = (data.results || []).map(item => ({
          id: item.id, realId: item.id, title: item.title, image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%Dpostera',
          rating: item.vote_average ? item.vote_average.toFixed(1) : '0.0', year: item.release_date?.substring(0, 4) || '—', type: 'movie', overview: item.overview || ''
        }));

        if (!isSearch) {
          items = items.filter(i => {
            const text = (i.overview + i.title).toLowerCase();
            return !text.includes('аниме') && !text.includes('манга') && !text.includes('япония');
          });
        }

        const slicedItems = items.slice(0, 18);
        setContent(slicedItems);
        setHasMore(items.length > 18 || (data.page < data.total_pages));
        setLoading(false);
      }).catch(() => { if (isCurrentRequest) { setLoading(false); setHasMore(false); } });
    } 

    else if (contentType === 'anime') {
      let url = '';
      if (isSearch) {
        url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=24`;
      } else if (selectedGenre) {
        url = `https://api.jikan.moe/v4/anime?genres=${selectedGenre}&order_by=score&sort=desc&page=${page}&limit=24`;
      } else {
        url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=24`;
      }
      fetch(url)
        .then(res => {
          if (res.status === 429) throw new Error("Too Many Requests");
          return res.json();
        })
        .then(data => {
          if (!isCurrentRequest) return;
          const parsedAnime = (data.data || []).map(item => ({
            id: item.mal_id, realId: item.mal_id, title: item.title_japanese || item.title, image: item.images?.jpg?.image_url || 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%Dpostera',
            rating: item.score ? item.score.toFixed(1) : '0.0', year: item.aired?.from?.substring(0, 4) || '—', type: 'anime', overview: item.synopsis
          }));

          setContent(parsedAnime);
          setHasMore(parsedAnime.length === 24 && data.pagination?.has_next_page !== false); 
          setLoading(false);
        })
        .catch(() => { 
          if (isCurrentRequest) {
            setHasMore(false);
            setLoading(false); 
          }
        });
    }

    else if (contentType === 'actors') {
      let url1 = isSearch
        ? `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page}`
        : `${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page}`;

      let url2 = isSearch
        ? `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedSearch)}&language=ru-RU&page=${page + 1}`
        : `${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page + 1}`;

      Promise.all([
        fetch(url1).then(res => res.json()).catch(() => ({ results: [] })),
        fetch(url2).then(res => res.json()).catch(() => ({ results: [] }))
      ])
      .then(([data1, data2]) => {
        if (!isCurrentRequest) return;

        const allResults = [...(data1.results || []), ...(data2.results || [])];
        const slicedResults = allResults.slice(0, 21);

        const items = slicedResults.map(item => ({
          id: `actor-${item.id}`,
          realId: item.id,
          name: item.name,
          image: item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : 'https://via.placeholder.com/500x750?text=%D0%9D%D0%B5%D1%82+%D1%84%D0%BE%D1%82%D0%BE',
          type: 'actor',
          knownForDepartment: item.known_for_department,
          knownFor: item.known_for
        }));

        setContent(items);
        setHasMore(data1.page < data1.total_pages);
        setLoading(false);
      })
      .catch(() => { if (isCurrentRequest) { setLoading(false); setHasMore(false); } });
    }

    return () => {
      isCurrentRequest = false;
    };

  }, [contentType, debouncedSearch, page, selectedGenre]);

  useEffect(() => {
    if (contentType === 'favorites') {
      setContent(favorites);
    }
  }, [favorites, contentType]);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setTrailerKey(null);
    setModalCast([]);
    setNewCommentText(''); 

    if (item.type === 'movie' || item.type === 'tv') {
      fetch(`${TMDB_BASE_URL}/${item.type === 'tv' ? 'tv' : 'movie'}/${item.realId}/videos?api_key=${TMDB_API_KEY}&language=ru-RU`)
        .then(res => res.json())
        .then(data => {
          const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || data.results?.[0];
          if (trailer) setTrailerKey(trailer.key);
        });

      fetch(`${TMDB_BASE_URL}/${item.type === 'tv' ? 'tv' : 'movie'}/${item.realId}/credits?api_key=${TMDB_API_KEY}&language=ru-RU`)
        .then(res => res.json())
        .then(castData => {
          if (castData && castData.cast) {
            const formattedCast = castData.cast.slice(0, 6).map(actor => ({
              id: actor.id,
              name: actor.name,
              character: actor.character
            }));
            setModalCast(formattedCast);
          }
        })
        .catch(err => console.error("Ошибка при загрузке актеров TMDB:", err));

    } else if (item.type === 'anime') {
      fetch(`https://api.jikan.moe/v4/anime/${item.realId}/characters`)
        .then(res => res.json())
        .then(charData => {
          if (charData && charData.data) {
            const formattedCast = charData.data.slice(0, 6).map(char => {
              const jpVoiceActor = char.voice_actors?.find(va => va.language === 'Japanese');
              return {
                id: char.character.mal_id,
                name: jpVoiceActor ? jpVoiceActor.person.name : 'Не указан',
                character: char.character.name
              };
            });
            setModalCast(formattedCast);
          }
        })
        .catch(err => console.error("Ошибка при загрузке актеров Jikan:", err));
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedItem) return;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const itemId = selectedItem.id; 

    const newComment = {
      id: Date.now(), 
      text: newCommentText,
      author: currentUser.username, 
      date: new Date().toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    };

    const updatedComments = {
      ...comments,
      [itemId]: [...(comments[itemId] || []), newComment]
    };

    setComments(updatedComments);
    localStorage.setItem('movie_comments', JSON.stringify(updatedComments));
    setNewCommentText(''); 
  };

  const handleDeleteComment = (commentId) => {
    if (!selectedItem) return;
    const itemId = selectedItem.id;

    const updatedCurrentComments = comments[itemId].filter(c => c.id !== commentId);
    
    const updatedComments = {
      ...comments,
      [itemId]: updatedCurrentComments
    };

    setComments(updatedComments);
    localStorage.setItem('movie_comments', JSON.stringify(updatedComments));
  };

  const handlePageChange = (newPage) => {
    setContent([]); 
    setPage(newPage);
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageTitle = () => {
    switch(contentType) {
      case 'all': return 'Весь контент';
      case 'movie': return 'Популярные фильмы';
      case 'tv': return 'Популярные сериалы';
      case 'cartoon': return 'Мультфильмы';
      case 'anime': return 'Топовое аниме';
      case 'actors': return 'Популярные актёры';
      case 'favorites': return 'Моё избранное';
      default: return '';
    }
  };

  const currentItemComments = selectedItem ? (comments[selectedItem.id] || []) : [];

  return (
    <div className="homepage-container">
      <Header 
        contentType={contentType} 
        handleTypeChange={handleContentTypeChange} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setPage={setPage} 
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <div className="homepage-body">
        
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
          
          <Sidebar 
            contentType={contentType} 
            selectedGenre={selectedGenre} 
            setSelectedGenre={handleGenreChange} 
            setPage={setPage} 
            customGenres={getCurrentGenres()} 
          />
        </div>
        
        <main className="homepage-main">
          <div className="main-content-wrapper">
            
            <div className="title-container-row">
              {getCurrentGenres().length > 0 && (
                <button className="mobile-menu-trigger" onClick={() => setIsSidebarOpen(true)}>
                  ☰ Жанры
                </button>
              )}
              <h2 className="page-title">{getPageTitle()}</h2>
            </div>
            
            <div className="cards-grid">
              {loading ? (
                 Array.from({ length: 12 }).map((_, idx) => <SkeletonCard key={idx} />)
              ) : content.length > 0 ? (
                content.map(item => (
                  item.type === 'actor' ? (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        fetch(`${TMDB_BASE_URL}/person/${item.realId}?api_key=${TMDB_API_KEY}&language=ru-RU`)
                          .then(res => res.json())
                          .then(fullDetails => {
                            setSelectedActor({
                              ...item,
                              biography: fullDetails.biography || "Биография временно отсутствует на русском языке.",
                              birthday: fullDetails.birthday || "—",
                              placeOfBirth: fullDetails.place_of_birth || "—"
                            });
                          })
                          .catch(() => { setSelectedActor(item); });
                      }} 
                      style={{ 
                        cursor: 'pointer', backgroundColor: '#1a1a1a', borderRadius: '10px',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        width: '100%', height: '100%', minHeight: '340px', border: '1px solid #2a2a2a', boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ width: '100%', height: '260px', overflow: 'hidden', position: 'relative' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                        <h3 style={{ 
                          fontSize: '14px', color: '#fff', margin: '0 0 6px 0', fontWeight: '600', lineHeight: '1.3',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', height: '36px'
                        }}>
                          {item.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ color: '#00b4d8', fontSize: '12px', fontWeight: '500' }}>Звезда кино</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <MovieCard key={item.id} item={item} favorites={favorites} toggleFavorite={toggleFavorite} onClick={() => handleOpenModal(item)} />
                  )
                ))
              ) : (
                <div className="empty-content">
                  <p>Контент пуст</p>
                  <p>На этой странице или фильтре нет доступных элементов.</p>
                </div>
              )}
            </div>

            {contentType !== 'favorites' && (content.length > 0 || page > 1) && !loading && (
              <Pagination 
                page={page} 
                hasMore={hasMore} 
                handlePageChange={handlePageChange} 
              />
            )}

            {contentType === 'all' && !loading && (
  <>
    <MovieCarousel 
      title="Лучшие фильмы" 
      items={topRated} 
      favorites={favorites} 
      toggleFavorite={toggleFavorite} 
      onCardClick={(item) => handleOpenModal(item)} 
    />
    <MovieCarousel 
      title="Ожидаемые новинки" 
      items={upcoming} 
      favorites={favorites} 
      toggleFavorite={toggleFavorite} 
      onCardClick={(item) => handleOpenModal(item)}
    />
  </>
)}
          </div>
          
          <Footer />
        </main>
      </div>
      
      <ScrollToTop />

      {selectedItem && (
        <DetailsModal 
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          trailerKey={trailerKey}
          modalCast={modalCast}
          contentType={contentType}
          currentItemComments={currentItemComments}
          currentUser={currentUser}
          newCommentText={newCommentText}
          setNewCommentText={setNewCommentText}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          authMode={authMode}
          setAuthMode={setAuthMode}
          authUsername={authUsername}
          setAuthUsername={setAuthUsername}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authError={authError}
          setAuthError={setAuthError}
          handleAuthSubmit={handleAuthSubmit}
          closeAuthModal={closeAuthModal}
        />
      )}

      {selectedActor && (
        <ActorModal 
          actor={selectedActor} 
          onClose={() => setSelectedActor(null)} 
        />
      )}
    </div>
  );
}