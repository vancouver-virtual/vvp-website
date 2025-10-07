'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../../design/tokens.json';
import LandingSection from '@/components/LandingSection';
import ServicesSection from '@/components/ServicesSection';
import VisionSection from '@/components/VisionSection';
import ContactSection from '@/components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (href: string) => {
    // Cleanup ScrollTrigger before navigating
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    router.push(href);
  };

  useEffect(() => {
    const sections = sectionsRef.current;
    const container = containerRef.current;

    if (!sections || !container) return;

    // Kill existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Reset transform
    gsap.set(sections, { x: 0 });

    const landingWidth = window.innerWidth;

    // Calculate services card scroll distance
    const cardWidth = 330;
    const gap = 32; // tokens.spacing['2xl']
    const totalCards = 8; // services.length
    const cardsPerRow = Math.ceil(totalCards / 2);
    const totalWidth = (cardWidth * cardsPerRow) + (gap * (cardsPerRow - 1));
    const viewportWidth = window.innerWidth - 400 - (48 * 3); // Subtract left content and padding
    const cardsScrollDistance = Math.max(0, totalWidth - viewportWidth);

    // Horizontal scroll distance (Landing to Services + cards scroll + hold)
    const horizontalScrollHeight = landingWidth + (cardsScrollDistance * 2) + (window.innerHeight * 0.5);

    let currentSection = '';

    // Get the cards container
    const cardsContainer = sections?.querySelector('[data-cards-container]') as HTMLElement;

    // Create timeline for horizontal scroll (Landing -> Services only)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${horizontalScrollHeight}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const landingThreshold = landingWidth / horizontalScrollHeight;
          const newSection = progress < landingThreshold ? '' : 'services';

          // Update URL
          if (newSection !== currentSection) {
            currentSection = newSection;
            const newUrl = newSection ? `/#${newSection}` : '/';
            window.history.replaceState(null, '', newUrl);
          }

          // Update section states
          const landingSection = sections?.querySelector('[data-section="landing"]');
          const servicesSection = sections?.querySelector('[data-section="services"]');

          if (landingSection) {
            landingSection.classList.toggle('is-active', progress < landingThreshold);
          }
          if (servicesSection) {
            servicesSection.classList.toggle('is-active', progress >= landingThreshold);
          }
        },
      },
    });

    // Horizontal scroll: Landing to Services
    tl.to(sections, {
      x: -landingWidth,
      ease: 'none',
    }, 0);

    // Scroll the service cards horizontally (starts AFTER landing scroll completes)
    if (cardsContainer && cardsScrollDistance > 0) {
      tl.to(cardsContainer, {
        x: -cardsScrollDistance,
        ease: 'none',
      }, `>`);
    }

    // Hold position at the end
    tl.to(sections, {
      x: -landingWidth,
      ease: 'none',
    }, `>`);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          overflow: 'hidden',
          height: '100vh',
          width: '100vw',
          position: 'relative',
        }}
      >
        {/* Fixed stationary black background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: tokens.colors.bg.base,
          zIndex: 0,
        }} />

        {/* Right Menu Bar - Absolute position so it scrolls with content */}
        <div style={{
          position: 'absolute',
          top: `${tokens.spacing.xl}px`,
          right: `${tokens.spacing.xl}px`,
          bottom: `${tokens.spacing.xl}px`,
          width: isMenuOpen ? '480px' : '90px',
          background: tokens.colors.glass.bg,
          backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`,
          border: `1px solid ${tokens.colors.glass.border}`,
          borderRadius: `${tokens.radii.md}px`,
          boxShadow: tokens.elevation.e2,
          zIndex: tokens.z.menu,
          display: 'flex',
          flexDirection: 'column',
          padding: `${tokens.spacing.lg}px`,
          transition: `width ${tokens.motion.dur.slow}ms ${tokens.motion.ease.emphasis}`,
          overflow: 'hidden',
        }}>
        {/* Logo and Header */}
        <div style={{
          marginBottom: isMenuOpen ? `${tokens.spacing.lg}px` : `${tokens.spacing.xl}px`,
        }}>
          {isMenuOpen ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${tokens.spacing.md}px`,
                marginBottom: `${tokens.spacing.sm}px`,
              }}>
                <Image
                  src="/images/logo-VVP-white.png"
                  alt="VVP"
                  width={40}
                  height={16}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxHeight: '20px',
                  }}
                />
                <h1 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.letterSpacing.nav,
                  color: tokens.colors.on.bg,
                  margin: 0,
                }}>
                  Vancouver Virtual Productions
                </h1>
              </div>
              <p style={{
                color: tokens.colors.on.bgSecondary,
                fontSize: '13px',
                lineHeight: '1.5',
                margin: 0,
              }}>
                Delivering world-class virtual production experiences combining cutting-edge LED wall technology with immersive environments. We specialize in commercial, cinema, sports, podcasting, live events, product reveals, music videos, and creating unforgettable immersive experiences that push the boundaries of visual storytelling.
              </p>
            </div>
          ) : (
            <Image
              src="/images/logo-VVP-white.png"
              alt="Vancouver Virtual Productions"
              width={60}
              height={24}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
              }}
            />
          )}
        </div>

        {/* Centered text for collapsed state */}
        {!isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(360deg)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.letterSpacing.nav,
              color: tokens.colors.on.bg,
              textAlign: 'center',
              lineHeight: '1.2',
            }}>
              Vancouver Virtual
            </div>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div style={{ flex: 1 }} />

        {/* Expanded Menu Content */}
        {isMenuOpen && (
          <div style={{
            marginBottom: `${tokens.spacing.md}px`,
            opacity: isMenuOpen ? 1 : 0,
            transition: `opacity ${tokens.motion.dur.base}ms ${tokens.motion.ease.standard}`,
          }}>

            {/* Explore Section */}
            <div style={{
              marginBottom: `${tokens.spacing.lg}px`,
            }}>
              <p style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.letterSpacing.nav,
                marginBottom: `${tokens.spacing.sm}px`,
                color: tokens.colors.on.bg,
              }}>
                Explore
              </p>
              <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${tokens.spacing.sm}px`,
              }}>
                {[
                  { label: 'Services', href: '#services' },
                  { label: 'Our Vision', href: '#vision' },
                  { label: 'Tour the Facility', href: '/tour' },
                  { label: 'Meet the Team', href: '/team' },
                ].map((item) => (
                  item.href.startsWith('/') ? (
                    <button
                      key={item.label}
                      onClick={() => handleNavigate(item.href)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${tokens.colors.glass.border}`,
                        borderRadius: `${tokens.radii.pill}px`,
                        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                        color: tokens.colors.on.bg,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: tokens.typography.letterSpacing.nav,
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
                        textDecoration: 'none',
                        display: 'block',
                        textAlign: 'center',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.85';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${tokens.colors.glass.border}`,
                        borderRadius: `${tokens.radii.pill}px`,
                        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                        color: tokens.colors.on.bg,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: tokens.typography.letterSpacing.nav,
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
                        textDecoration: 'none',
                        display: 'block',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.85';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </nav>
            </div>

            {/* Contact Section */}
            <div style={{
              marginBottom: `${tokens.spacing.lg}px`,
              paddingTop: `${tokens.spacing.sm}px`,
              borderTop: `1px solid ${tokens.colors.divider.subtle}`,
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.letterSpacing.nav,
                marginBottom: `${tokens.spacing.sm}px`,
                color: tokens.colors.on.bg,
              }}>
                Contact
              </p>
              <div style={{
                display: 'flex',
                gap: `${tokens.spacing.sm}px`,
              }}>
                {['Email', 'Call', 'Locations'].map((item) => (
                  <button
                    key={item}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${tokens.colors.glass.border}`,
                      borderRadius: `${tokens.radii.pill}px`,
                      padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
                      color: tokens.colors.on.bgSecondary,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: tokens.typography.letterSpacing.nav,
                      fontSize: '9px',
                      cursor: 'pointer',
                      transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.85';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              paddingTop: `${tokens.spacing.sm}px`,
              borderTop: `1px solid ${tokens.colors.divider.subtle}`,
              color: tokens.colors.on.bgSecondary,
              fontSize: '8px',
              lineHeight: '1.3',
            }}>
              <p style={{ margin: 0 }}>
                © 2025 Vancouver Virtual Productions. All videos, images, and content displayed on this site are proprietary and protected by copyright. Unauthorized use, reproduction, or distribution is strictly prohibited. This site is for demonstration and promotional purposes only.
              </p>
            </div>
          </div>
        )}

        {/* Plus/Close Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: tokens.colors.glass.bg,
            border: `1px solid ${tokens.colors.glass.border}`,
            color: tokens.colors.on.bg,
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
            transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          +
        </button>
      </div>

        <div
          ref={sectionsRef}
          style={{
            display: 'flex',
            height: '100vh',
            willChange: 'transform',
          }}
        >
          <LandingSection />
          <ServicesSection />
        </div>
      </div>

      {/* Vision and Contact sections - normal vertical scroll */}
      <VisionSection />
      <ContactSection />
    </>
  );
}
