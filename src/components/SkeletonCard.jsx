export default function SkeletonCard() {
  return (
    <div style={{ background: '#181818', borderRadius: '10px', overflow: 'hidden', border: '1px solid #222', height: '316px', position: 'relative' }}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        .skeleton-blink { animation: pulse 1.5s infinite ease-in-out; background: #252525; }
      `}</style>
      <div className="skeleton-blink" style={{ width: '100%', height: '260px' }} />
      <div style={{ padding: '12px' }}>
        <div className="skeleton-blink" style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
      </div>
    </div>
  );
}