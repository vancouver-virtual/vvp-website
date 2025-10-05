import { useState, useRef } from 'react';
import tokens from '../../design/tokens.json';

export default function LandingSection() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayWithSound = () => {
    setIsFullscreen(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleClose = () => {
    setIsFullscreen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: 'calc(100vw + 1px)',
      height: '100vh',
      flexShrink: 0,
      scrollSnapAlign: 'start',
    }}>
      {/* Background Video */}
      {!isFullscreen && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              objectFit: 'cover',
              zIndex: tokens.z.videoBg,
            }}
          >
            <source src="/videos/TL_Square_Splash_Video.webm" type="video/webm" />
          </video>

          {/* Play with Sound Button */}
          <button
            onClick={handlePlayWithSound}
            style={{
              position: 'absolute',
              bottom: `${tokens.spacing['2xl']}px`,
              left: `${tokens.spacing['2xl']}px`,
              padding: `${tokens.spacing.lg}px ${tokens.spacing.xl}px`,
              backgroundColor: '#f5f5f5',
              backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
              border: `1px solid ${tokens.colors.glass.border}`,
              borderRadius: `${tokens.radii.pill}px`,
              cursor: 'pointer',
              fontSize: tokens.typography.size.body,
              fontWeight: tokens.typography.weight.heavy,
              letterSpacing: tokens.typography.letterSpacing.nav,
              textTransform: 'uppercase',
              color: '#333333',
              zIndex: tokens.z.content,
              transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
              opacity: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.color = '#f5f5f5';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#333333';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${tokens.colors.focus.ring}`;
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            Play with sound
          </button>
        </>
      )}

      {/* Fullscreen Video with Audio */}
      {isFullscreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: tokens.colors.bg.base,
          zIndex: tokens.z.scrim,
        }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              objectFit: 'cover',
            }}
          >
            <source src="/videos/TL_Square_Splash_Video_Ultra_Compressed.mkv" type="video/x-matroska" />
          </video>

          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              bottom: `${tokens.spacing['2xl']}px`,
              left: `${tokens.spacing['2xl']}px`,
              width: '44px',
              height: '44px',
              backgroundColor: 'transparent',
              border: `1px solid ${tokens.colors.glass.border}`,
              borderRadius: `${tokens.radii.pill}px`,
              cursor: 'pointer',
              fontSize: '24px',
              color: tokens.colors.on.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: tokens.z.fsControls,
              transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.glass.highlight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${tokens.colors.focus.ring}`;
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
