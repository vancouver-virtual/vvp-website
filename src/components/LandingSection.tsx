import { useState } from 'react';
import tokens from '../../design/tokens.json';

export default function LandingSection() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlayWithSound = () => {
    setIsFullscreen(true);
  };

  const handleClose = () => {
    setIsFullscreen(false);
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
          <iframe
            src="https://player.vimeo.com/video/391516939?background=1&autoplay=1&loop=1&byline=0&title=0"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              border: 'none',
              zIndex: tokens.z.videoBg,
            }}
            allow="autoplay; fullscreen"
            title="Background Video"
          />

          {/* Play with Sound Button */}
          <button
            onClick={handlePlayWithSound}
            style={{
              position: 'absolute',
              bottom: `${tokens.spacing['2xl']}px`,
              left: `${tokens.spacing['2xl']}px`,
              padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
              backgroundColor: tokens.colors.glass.bg,
              backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
              border: `1px solid ${tokens.colors.glass.border}`,
              borderRadius: `${tokens.radii.pill}px`,
              cursor: 'pointer',
              fontSize: tokens.typography.size.body,
              fontWeight: tokens.typography.weight.heavy,
              letterSpacing: tokens.typography.letterSpacing.nav,
              textTransform: 'uppercase',
              color: tokens.colors.on.bg,
              zIndex: tokens.z.content,
              transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
              opacity: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
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
          <iframe
            src="https://player.vimeo.com/video/391516939?autoplay=1&loop=1&byline=0&title=0"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              border: 'none',
            }}
            allow="autoplay; fullscreen"
            title="Fullscreen Video"
          />

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
