import tokens from '../../../design/tokens.json';
import BackButton from '@/components/BackButton';

export default function TourPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: tokens.colors.bg.base,
      color: tokens.colors.on.bg,
    }}>
      {/* Header / Back Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: `${tokens.spacing.xl}px ${tokens.spacing['3xl']}px`,
        background: tokens.colors.glass.bg,
        backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
        borderBottom: `1px solid ${tokens.colors.glass.border}`,
        zIndex: tokens.z.menu,
        display: 'flex',
        alignItems: 'center',
        gap: `${tokens.spacing.xl}px`,
      }}>
        <BackButton />
      </div>

      {/* Content */}
      <div style={{
        paddingTop: '120px',
        padding: `120px ${tokens.spacing['3xl']}px ${tokens.spacing['3xl']}px`,
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: tokens.typography.weight.heavy,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            lineHeight: '1',
            margin: `0 0 ${tokens.spacing.xl}px 0`,
            color: tokens.colors.on.bg,
          }}>
            Coming Soon
          </h1>
          <p style={{
            fontSize: '24px',
            color: tokens.colors.on.bgSecondary,
            lineHeight: '1.4',
            margin: 0,
          }}>
            We&apos;re building something great for you to see. Check back later.
          </p>
        </div>
      </div>
    </div>
  );
}
