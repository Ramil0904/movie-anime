import React from 'react';

export default function AuthModal({
  authMode,
  setAuthMode,
  authUsername,
  setAuthUsername,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  handleAuthSubmit,
  closeAuthModal
}) {
  return (
    <div 
      className="modal-overlay" 
      onClick={closeAuthModal} 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 2000,
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px',
          maxWidth: '400px', width: '100%', padding: '30px', position: 'relative',
          color: '#fff', boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        }}
      >
        <button 
          onClick={closeAuthModal} 
          style={{
            position: 'absolute', top: '15px', right: '20px', background: 'none',
            border: 'none', color: '#888', fontSize: '28px', cursor: 'pointer', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          ×
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#fff', fontWeight: '700' }}>
          {authMode === 'login' ? 'Войти в аккаунт' : 'Регистрация'}
        </h2>

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#aaa' }}>Имя пользователя</label>
            <input 
              type="text" 
              placeholder="Введите логин"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              style={{
                padding: '12px', borderRadius: '8px', border: '1px solid #333',
                backgroundColor: '#222', color: '#fff', fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#aaa' }}>Пароль</label>
            <input 
              type="password" 
              placeholder="Введите пароль"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              style={{
                padding: '12px', borderRadius: '8px', border: '1px solid #333',
                backgroundColor: '#222', color: '#fff', fontSize: '14px'
              }}
            />
          </div>

          {authError && <p style={{ color: '#E50914', fontSize: '13px', margin: 0 }}>{authError}</p>}

          <button 
            type="submit" 
            style={{
              padding: '12px', borderRadius: '8px', border: 'none',
              backgroundColor: '#E50914', color: '#fff', fontSize: '16px',
              fontWeight: '600', cursor: 'pointer', marginTop: '10px'
            }}
          >
            {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
          {authMode === 'login' ? 'Ещё нет аккаунта? ' : 'Уже зарегистрированы? '}
          <span 
            onClick={() => {
              setAuthError('');
              setAuthMode(authMode === 'login' ? 'register' : 'login');
            }} 
            style={{ color: '#E50914', cursor: 'pointer', fontWeight: '500' }}
          >
            {authMode === 'login' ? 'Создать' : 'Войти'}
          </span>
        </p>
      </div>
    </div>
  );
}