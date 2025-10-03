import tokens from '../../design/tokens.json';

const services = [
  'Commercial',
  'Cinema',
  'Sports',
  'Podcasting',
  'Live Event Space',
  'Product Reveal Stage',
  'Music Videos',
  'Immersive Experiences'
];

export default function ServicesSection() {
  return (
    <div style={{
      position: 'relative',
      width: 'calc(100vw + 1px)',
      height: '100vh',
      flexShrink: 0,
      scrollSnapAlign: 'start',
      background: tokens.colors.bg.base,
      padding: `${tokens.spacing['3xl']}px`,
    }}>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(2, 1fr)',
          gridAutoFlow: 'column',
          gridAutoColumns: '400px',
          gap: `${tokens.spacing.xl}px`,
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {services.map((service) => (
          <div
            key={service}
            style={{
              background: tokens.colors.glass.bg,
              backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
              border: `1px solid ${tokens.colors.glass.border}`,
              borderRadius: `${tokens.radii.lg}px`,
              padding: `${tokens.spacing.xl}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.colors.on.bg,
              fontSize: '24px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.nav,
              transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {service}
          </div>
        ))}
      </div>
    </div>
  );
}
