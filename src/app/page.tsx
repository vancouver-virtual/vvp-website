export default function Home() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Vancouver Virtual Productions</h1>
        <p className="hero-description">
          A website for showcasing virtual production services and work
        </p>
        
        <div className="cta-buttons">
          <button 
            className="cta-button primary"
            aria-label="Play with sound functionality"
          >
            Play with sound
          </button>
          <button 
            className="cta-button secondary"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
