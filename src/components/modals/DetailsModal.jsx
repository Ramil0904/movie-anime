import React from 'react';

export default function DetailsModal({
  selectedItem,
  setSelectedItem,
  trailerKey,
  modalCast,
  contentType,
  currentItemComments,
  currentUser,
  newCommentText,
  setNewCommentText,
  handleAddComment,
  handleDeleteComment
}) {
  if (!selectedItem) return null;

  const hasTrailer = trailerKey && trailerKey !== 'null' && trailerKey !== '{trailerKey}';

  return (
    <div 
      className="details-modal-overlay" 
      onClick={() => setSelectedItem(null)} 
      style={{ 
        zIndex: 5000, 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        background: 'rgba(0,0,0,0.85)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <style>{`
        .modal-content-custom::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div 
        className="modal-content modal-content-custom" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '550px', 
          width: '90%', 
          padding: '25px', 
          background: '#141414', 
          borderRadius: '12px', 
          border: '1px solid #333', 
          color: '#fff', 
          position: 'relative', 
          maxHeight: '85vh', 
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        
        <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', color: '#fff', textAlign: 'center' }}>
          {selectedItem.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {hasTrailer ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe
                src={"https://youtube.com/embed/" + trailerKey}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>
          ) : (
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '300px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #333',
              background: '#222'
            }}>
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: 0.3 
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                zIndex: 2
              }}>
                <span style={{ fontSize: '36px' }}>🎬</span>
                <p style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  Трейлер отсутствует
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', background: '#1c1c1c', padding: '10px', borderRadius: '6px' }}>
            <span style={{ color: '#ffb703', fontWeight: 'bold' }}>★ {selectedItem.rating}</span>
            <span style={{ color: '#aaa' }}>Год: {selectedItem.year}</span>
          </div>
          
          <p style={{ color: '#bbb', lineHeight: '1.5', fontSize: '14px', margin: '5px 0', textAlign: 'justify' }}>
            {selectedItem.overview || 'Описание для данного релиза временно отсутствует.'}
          </p>

          {modalCast && modalCast.length > 0 && (
         <div>
             <h4
                style={{
                  fontSize: '15px',
                  marginBottom: '8px',
                  color: '#ffb703'
                }}
                >
               {contentType === 'anime' || contentType === 'cartoon'
                  ? 'Актёры озвучивания:'
                  : 'В главных ролях:'}
             </h4>

          <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}
              >
             {modalCast.map(actor => (
          <div
              key={actor.id}
              style={{
                background: '#1c1c1c',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #222'
              }}
              >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#fff'
            }}
          >
            {actor.name}
          </div>

          <div
            style={{
              fontSize: '11px',
              color: '#777'
            }}
          >
            {actor.character}
              </div>
            </div>
          ))}
          </div>
        </div>
        )}

          <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '5px 0' }} />

          <div>
            <h4 style={{ fontSize: '15px', marginBottom: '10px' }}>Комментарии ({currentItemComments.length})</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
              <textarea
                rows="2"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={currentUser ? "Напишите комментарий..." : "Войдите, чтобы оставить комментарий"}
                style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', borderRadius: '6px', color: '#fff', boxSizing: 'border-box', resize: 'none', fontSize: '13px' }}
              />
              <button
                onClick={handleAddComment}
                style={{ alignSelf: 'flex-end', background: '#E50914', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Отправить
              </button>
            </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
           {currentItemComments.length > 0 ? (
            currentItemComments.map(comment => (
      <div 
        key={comment.id} 
        style={{ 
          background: '#1c1c1c', 
          padding: '10px', 
          paddingBottom: '24px',
          borderRadius: '6px', 
          border: '1px solid #222', 
          position: 'relative' 
        }}
      >
        
        <div style={{ marginBottom: '6px' }}>
          <span style={{ fontWeight: 'bold', color: '#00b4d8', fontSize: '13px' }}>{comment.author}</span>
        </div>
        
        <p style={{ 
          margin: 0, 
          color: '#ccc', 
          fontSize: '13px', 
          lineHeight: '1.3', 
          paddingRight: '25px',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}>
          {comment.text}
        </p>
        
        {currentUser && currentUser.username === comment.author && (
          <button
            onClick={() => handleDeleteComment(comment.id)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#555', 
              position: 'absolute', 
              top: '8px', 
              right: '10px', 
              cursor: 'pointer', 
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '1',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E50914'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
            title="Удалить комментарий"
          >
            ×
          </button>
        )}
        <span style={{ 
          color: '#555', 
          fontSize: '11px',
          position: 'absolute',
          bottom: '6px',
          right: '10px' 
        }}>
          {comment.date}
        </span>

      </div>
    ))
  ) : (
    <p style={{ color: '#555', fontStyle: 'italic', margin: 0, fontSize: '13px' }}>Нет комментариев.</p>
  )}
        </div>



          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              onClick={() => setSelectedItem(null)} 
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
    </div>
  );
}
