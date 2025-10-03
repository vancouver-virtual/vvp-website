'use client';

import tokens from '../../design/tokens.json';

export default function ContactButton({ serviceName }: { serviceName: string }) {
  return (
    <div style={{
      marginTop: `${tokens.spacing['3xl']}px`,
      padding: `${tokens.spacing['3xl']}px`,
      background: tokens.colors.glass.bg,
      backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
      border: `1px solid ${tokens.colors.glass.border}`,
      borderRadius: `${tokens.radii.lg}px`,
      textAlign: 'center',
    }}>
      <h3 style={{
        fontSize: '32px',
        fontWeight: tokens.typography.weight.heavy,
        marginBottom: `${tokens.spacing.lg}px`,
        textTransform: 'uppercase',
      }}>
        Ready to create?
      </h3>
      <p style={{
        fontSize: tokens.typography.size.body,
        color: tokens.colors.on.bgSecondary,
        marginBottom: `${tokens.spacing.xl}px`,
        maxWidth: '600px',
        margin: `0 auto ${tokens.spacing.xl}px`,
      }}>
        Let&apos;s discuss how our {serviceName.toLowerCase()} services can bring your vision to life.
      </p>
      <button
        style={{
          background: tokens.colors.on.bg,
          color: tokens.colors.bg.base,
          border: 'none',
          borderRadius: `${tokens.radii.pill}px`,
          padding: `${tokens.spacing.lg}px ${tokens.spacing['2xl']}px`,
          fontSize: tokens.typography.size.body,
          fontWeight: tokens.typography.weight.bold,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.letterSpacing.nav,
          cursor: 'pointer',
          transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Contact Us
      </button>
    </div>
  );
}

