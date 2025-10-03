import tokens from '../../design/tokens.json';

export default function LandingSection() {
  return (
    <div style={{
      position: 'relative',
      width: 'calc(100vw + 1px)',
      height: '100vh',
      flexShrink: 0,
      scrollSnapAlign: 'start',
    }}>
      {/* Background Video */}
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
    </div>
  );
}
