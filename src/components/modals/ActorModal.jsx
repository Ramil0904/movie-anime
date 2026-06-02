import React from 'react';

export default function ActorModal({ actor, onClose }) {
  if (!actor) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 5000,
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
      }}
    >
      <style>{`
        .actor-modal-content-custom::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div 
        className="modal-content actor-modal-content-custom" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px',
          maxWidth: '750px', width: '100%', padding: '30px', position: 'relative',
          color: '#fff', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 0 30px rgba(0,0,0,0.5)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0, width: '220px' }}>
            <img 
              src={actor.image} 
              alt={actor.name} 
              style={{ width: '100%', height: '330px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #333' }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ color: '#E50914', marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>
              {actor.name}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#ccc' }}>
              <p><strong style={{ color: '#fff' }}>Категория:</strong> {actor.knownForDepartment === 'Acting' ? 'Актёр / Актриса' : actor.knownForDepartment}</p>
              <p><strong style={{ color: '#fff' }}>Дата рождения:</strong> {actor.birthday}</p>
              <p><strong style={{ color: '#fff' }}>Место рождения:</strong> {actor.placeOfBirth}</p>
            </div>

            {/* Проекты */}
            <h4 style={{ color: '#ffb703', marginTop: '25px', marginBottom: '10px', fontSize: '18px' }}>
              Известность за проекты:
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#bbb', fontSize: '14px', lineHeight: '1.6' }}>
              {actor.knownFor && actor.knownFor.map(project => (
                <li key={project.id}>
                  <span style={{ color: '#fff', fontWeight: '500' }}>{project.title || project.name}</span> 
                  {project.release_date || project.first_air_date ? ` (${(project.release_date || project.first_air_date).substring(0, 4)})` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {actor.biography && (
          <div style={{ marginTop: '30px', borderTop: '1px solid #222', paddingTop: '20px' }}>
            <h4 style={{ color: '#ffb703', marginBottom: '12px', fontSize: '18px' }}>Biography:</h4>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', whiteSpace: 'pre-line' }}>
              {actor.biography}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button 
            onClick={onClose} 
            style={{ 
              background: '#222', 
              color: '#aaa', 
              border: '1px solid #444', 
              padding: '6px 16px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '12px',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#222';
              e.currentTarget.style.color = '#aaa';
              e.currentTarget.style.borderColor = '#444';
            }}
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}
