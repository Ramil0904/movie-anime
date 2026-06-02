import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TMDB_API_KEY = "a77e826362488e15776e2f9d2e69fdac";

export default function DetailPage() {
  const { type, id } = useParams(); 
  const [item, setItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setCast([]);

    const currentType = type === 'movie' ? 'movie' : 'tv';
    
    fetch(`https://api.themoviedb.org/3/${currentType}/${id}?api_key=${TMDB_API_KEY}&language=ru-RU`)
      .then(res => res.json())
      .then(data => {
        const releaseDate = data.release_date || data.first_air_date;
        
        setItem({
          title: data.title || data.name, 
          image: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
          rating: data.vote_average?.toFixed(1),
          overview: data.overview || 'Описание отсутствует.',
          tagline: data.tagline,
          year: releaseDate ? releaseDate.substring(0, 4) : '—',
          genres: data.genres?.map(g => g.name).join(', '),
          isAnimation: data.genres?.some(g => g.name.toLowerCase().includes('мульт') || g.name.toLowerCase().includes('аним'))
        });

        return fetch(`https://api.themoviedb.org/3/${currentType}/${id}/credits?api_key=${TMDB_API_KEY}&language=ru-RU`);
      })
      .then(res => res.json())
      .then(castData => {
        if (castData && castData.cast) {
          const formattedCast = castData.cast.slice(0, 7).map(actor => ({
            id: actor.id,
            name: actor.name,
            character: actor.character
          }));
          setCast(formattedCast);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка при загрузке данных из TMDB:", err);
        setLoading(false);
      });
  }, [type, id]);

  if (loading) return <h2 style={{ color: '#fff', padding: '40px' }}>Загрузка страницы...</h2>;
  if (!item) return <h2 style={{ color: '#fff', padding: '40px' }}>Элемент не найден</h2>;

  return (
    <div style={{ padding: '40px 4%', maxWidth: '900px', margin: '0 auto', color: '#fff', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold' }}>
        ← Назад к списку
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <img src={item.image} alt={item.title} style={{ width: '300px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>
            {item.title} <span style={{ color: '#888', fontSize: '26px' }}>({item.year})</span>
          </h1>
          {item.tagline && <p style={{ fontStyle: 'italic', color: '#aaa', fontSize: '18px', margin: '0 0 20px 0' }}>"{item.tagline}"</p>}
          
          <div style={{ background: '#181818', padding: '20px', borderRadius: '10px', border: '1px solid #222', marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0' }}>⭐ <strong style={{ color: '#ffb703' }}>Рейтинг:</strong> {item.rating}</p>
            <p style={{ margin: 0 }}>🎭 <strong>Жанры:</strong> {item.genres || 'Не указаны'}</p>
          </div>

          {cast.length > 0 && (
            <div style={{ marginBottom: '25px', background: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffb703', fontSize: '20px' }}>
                {item.isAnimation ? '🎙️ Актёры озвучки:' : '👥 В главных ролях:'}
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                {cast.map((actor, index) => (
                  <li key={actor.id || index} style={{ color: '#ccc', marginBottom: '4px' }}>
                    <strong style={{ color: '#fff' }}>{actor.name}</strong> — <span style={{ fontStyle: 'italic', color: '#aaa' }}>{actor.character}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3>Сюжет:</h3>
          <p style={{ lineHeight: '1.6', color: '#ccc' }}>{item.overview}</p>
        </div>
      </div>
    </div>
  );
}