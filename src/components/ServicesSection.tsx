'use client';

import { useRouter } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../../design/tokens.json';

const services = [
  { name: 'Commercial', label: 'COMMERCIAL', slug: 'commercial' },
  { name: 'Cinema', label: 'CINEMA', slug: 'cinema' },
  { name: 'Sports', label: 'SPORTS', slug: 'sports' },
  { name: 'Podcasting', label: 'PODCASTING', slug: 'podcasting' },
  { name: 'Live Event Space', label: 'LIVE EVENT SPACE', slug: 'live-event-space' },
  { name: 'Product Reveal Stage', label: 'PRODUCT REVEAL STAGE', slug: 'product-reveal-stage' },
  { name: 'Music Videos', label: 'MUSIC VIDEOS', slug: 'music-videos' },
  { name: 'Immersive Experiences', label: 'IMMERSIVE EXPERIENCES', slug: 'immersive-experiences' }
];

export default function ServicesSection() {
  const router = useRouter();

  const handleServiceClick = (slug: string) => {
    // Kill all ScrollTriggers before navigation to prevent DOM conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Small delay to let GSAP cleanup complete
    setTimeout(() => {
      router.push(`/services/${slug}`);
    }, 50);
  };

  return (
    <div style={{
      position: 'relative',
      width: 'calc(100vw + 1px)',
      height: '100vh',
      flexShrink: 0,
      scrollSnapAlign: 'start',
      background: tokens.colors.bg.base,
      padding: `${tokens.spacing['3xl']}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${tokens.spacing['2xl']}px`,
    }}>
      {/* Page Title */}
      <div style={{
        fontSize: tokens.typography.size.body,
        color: tokens.colors.on.bgSecondary,
        letterSpacing: tokens.typography.letterSpacing.wide,
        textTransform: 'uppercase',
        fontWeight: tokens.typography.weight.regular,
      }}>
        Services
      </div>

      <div style={{
        display: 'flex',
        gap: `${tokens.spacing['3xl']}px`,
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Left Content Block */}
        <div style={{
          flex: '0 0 400px',
          display: 'flex',
          flexDirection: 'column',
          gap: `${tokens.spacing['2xl']}px`,
          paddingTop: `${tokens.spacing.xl}px`,
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: tokens.typography.weight.heavy,
            color: tokens.colors.on.bg,
            lineHeight: '1.1',
            letterSpacing: '-0.5px',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            DIVERSE.<br />
            OPEN-MINDED.<br />
            RESOURCEFUL.<br />
            INFORMED.<br />
            ALIGNED.
          </h2>
          <p style={{
            fontSize: tokens.typography.size.body,
            color: tokens.colors.on.bgSecondary,
            lineHeight: '1.6',
            margin: 0,
          }}>
            Approximately 20% of AUM is internal capital invested alongside our clients.*
          </p>
        </div>

        {/* Services Grid - Offset Layout */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, 230px)',
            gridAutoFlow: 'column',
            gridAutoColumns: '330px',
            gap: `${tokens.spacing.xl}px`,
            alignContent: 'center',
            paddingRight: `${tokens.spacing['3xl']}px`,
          }}>
            {services.map((service, index) => {
              const row = index % 2;
              const isBottomRow = row === 1;

              return (
                <div
                  key={service.name}
                  onClick={() => handleServiceClick(service.slug)}
                  style={{
                    width: '330px',
                    height: '230px',
                    background: '#2C2E33',
                    borderRadius: `${tokens.radii.lg}px`,
                    padding: `${tokens.spacing.xl}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: `${tokens.spacing.md}px`,
                    color: tokens.colors.on.bg,
                    transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
                    cursor: 'pointer',
                    marginTop: isBottomRow ? `${tokens.spacing.xl}px` : 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = tokens.elevation.e2;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '11px',
                    color: tokens.colors.on.bgSecondary,
                    letterSpacing: tokens.typography.letterSpacing.wide,
                    textTransform: 'uppercase',
                    fontWeight: tokens.typography.weight.medium,
                  }}>
                    LEADERSHIP
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: tokens.typography.weight.heavy,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px',
                    lineHeight: '1.1',
                  }}>
                    {service.label}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: tokens.colors.on.bgSecondary,
                    lineHeight: '1.4',
                  }}>
                    Co-Founder<br />
                    Chief Investment Officer
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
