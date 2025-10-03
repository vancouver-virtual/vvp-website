'use client';

import tokens from '../../design/tokens.json';
import BackButton from './BackButton';

interface ServiceData {
  title: string;
  category: string;
  description: string;
  overview: string;
  capabilities: string[];
}

interface ServiceDetailProps {
  service: ServiceData | null;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  if (!service) {
    return (
      <div style={{
        minHeight: '100vh',
        background: tokens.colors.bg.base,
        color: tokens.colors.on.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div>Service not found</div>
      </div>
    );
  }

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
        <div style={{
          fontSize: tokens.typography.size.small,
          color: tokens.colors.on.bgSecondary,
          letterSpacing: tokens.typography.letterSpacing.wide,
          textTransform: 'uppercase',
        }}>
          {service.category}
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        paddingTop: '120px',
        padding: `120px ${tokens.spacing['3xl']}px ${tokens.spacing['3xl']}px`,
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          marginBottom: `${tokens.spacing['3xl']}px`,
        }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: tokens.typography.weight.heavy,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            lineHeight: '1',
            margin: `0 0 ${tokens.spacing.xl}px 0`,
          }}>
            {service.title}
          </h1>
          <p style={{
            fontSize: '24px',
            color: tokens.colors.on.bgSecondary,
            lineHeight: '1.4',
            maxWidth: '800px',
            margin: 0,
          }}>
            {service.description}
          </p>
        </div>

        {/* Overview Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: `${tokens.spacing['3xl']}px`,
          marginBottom: `${tokens.spacing['3xl']}px`,
        }}>
          <div>
            <h2 style={{
              fontSize: '14px',
              fontWeight: tokens.typography.weight.medium,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.wide,
              color: tokens.colors.on.bgSecondary,
              marginBottom: `${tokens.spacing.lg}px`,
            }}>
              Overview
            </h2>
            <p style={{
              fontSize: tokens.typography.size.body,
              lineHeight: '1.6',
              color: tokens.colors.on.bg,
              margin: 0,
            }}>
              {service.overview}
            </p>
          </div>

          <div>
            <h2 style={{
              fontSize: '14px',
              fontWeight: tokens.typography.weight.medium,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.wide,
              color: tokens.colors.on.bgSecondary,
              marginBottom: `${tokens.spacing.lg}px`,
            }}>
              Capabilities
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: `${tokens.spacing.md}px`,
            }}>
              {service.capabilities.map((capability, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: tokens.typography.size.body,
                    lineHeight: '1.6',
                    color: tokens.colors.on.bg,
                    paddingLeft: `${tokens.spacing.lg}px`,
                    position: 'relative',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: tokens.colors.on.bgSecondary,
                  }}>→</span>
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Placeholder for images/content */}
        <div style={{
          background: '#2C2E33',
          borderRadius: `${tokens.radii.lg}px`,
          padding: `${tokens.spacing['3xl']}px`,
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.colors.on.bgSecondary,
          fontSize: tokens.typography.size.body,
        }}>
          Image Gallery / Video Content Area
        </div>

        {/* Contact CTA */}
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
            Let's discuss how our {service.title.toLowerCase()} services can bring your vision to life.
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
      </div>
    </div>
  );
}
