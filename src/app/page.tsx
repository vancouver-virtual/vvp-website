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
  const [containerWidth, setContainerWidth] = useState('200vw');
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

    // Kill any existing ScrollTriggers to prevent conflicts when returning from other pages
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Reset transform on sections
    gsap.set(sections, { x: 0 });

    // Landing section takes up 100vw
    const landingSectionWidth = window.innerWidth;

    // Services section calculations
    const sectionPadding = 48; // tokens.spacing['3xl'] = 48px (both sides)
    const leftContentWidth = 400;
    const gapBetweenContentAndGrid = 48; // tokens.spacing['3xl']
    const cardWidth = 330;
    const cardGap = 24; // tokens.spacing['2xl'] = 24px
    const cardsPerRow = 4;
    const bottomRowOffset = 50; // offset for bottom row cards
    const gridPaddingRight = 48; // padding at the end of grid

    // Calculate total width of service cards grid
    const totalCardsWidth = (cardWidth * cardsPerRow) + (cardGap * (cardsPerRow - 1)) + bottomRowOffset;

    // Calculate how much of services section needs to be visible beyond the viewport
    const servicesContentWidth = sectionPadding + leftContentWidth + gapBetweenContentAndGrid + totalCardsWidth + gridPaddingRight + sectionPadding;

    // Vision section width - just 100vw (statements appear in place)
    const visionSectionWidth = window.innerWidth;

    // Contact section width - just 100vw (centered form)
    const contactSectionWidth = window.innerWidth;

    // Container needs to hold all four sections side by side
    // Landing (100vw) + Services (servicesContentWidth) + Vision (100vw) + Contact (100vw)
    const totalContainerWidth = landingSectionWidth + servicesContentWidth + visionSectionWidth + contactSectionWidth;
    const widthInVw = (totalContainerWidth / window.innerWidth) * 100;
    setContainerWidth(`${widthInVw}vw`);

    let currentSection = '';

    // Calculate horizontal scroll distance (how far we need to translate to show Contact)
    // We need to move past Landing (100vw), Services (servicesContentWidth), and Vision (100vw)
    const horizontalScrollDistance = landingSectionWidth + servicesContentWidth + visionSectionWidth;

    // Calculate thresholds for URL hash updates
    const landingEnd = landingSectionWidth;

    // Small delay to ensure DOM is ready and previous ScrollTriggers are fully cleaned up
    const timer = setTimeout(() => {
      // Create horizontal scroll animation with three stages:
      // Stage 1: Move through Landing + Services (translateX)
      // Stage 2: HOLD during Vision animations (no horizontal movement)
      // Stage 3: Move to Contact (translateX)

      const visionHoldScrollDistance = window.innerHeight * 1.5; // Scroll distance for Vision hold

      // Calculate pixel positions for each stage
      const stage1End = landingSectionWidth + servicesContentWidth; // End of Services
      const stage2End = stage1End; // Vision holds (same x position)
      const stage3End = stage1End + visionSectionWidth; // End at Contact

      // Total scroll distance
      const totalScrollDistance = stage1End + visionHoldScrollDistance + contactSectionWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalScrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (progress) => {
              // Calculate snap points
              const landingSnap = landingEnd / totalScrollDistance;
              const servicesSnap = stage1End / totalScrollDistance;
              const visionStart = stage1End / totalScrollDistance;
              const visionThird1 = (stage1End + (visionHoldScrollDistance * 0.33)) / totalScrollDistance;
              const visionThird2 = (stage1End + (visionHoldScrollDistance * 0.66)) / totalScrollDistance;
              const visionEnd = (stage1End + visionHoldScrollDistance) / totalScrollDistance;
              const contactSnap = 1.0;

              const snapPoints = [0, landingSnap, servicesSnap, visionThird1, visionThird2, visionEnd, contactSnap];

              // Find closest snap point
              let closest = snapPoints[0];
              let minDiff = Math.abs(progress - closest);

              for (const point of snapPoints) {
                const diff = Math.abs(progress - point);
                if (diff < minDiff) {
                  minDiff = diff;
                  closest = point;
                }
              }

              return closest;
            },
            duration: 0.5,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            // Update URL hash based on scroll progress
            const progress = self.progress;
            let newSection = '';

            // Calculate thresholds
            const landingThreshold = landingEnd / totalScrollDistance;
            const servicesThreshold = stage1End / totalScrollDistance;
            const visionThreshold = (stage1End + visionHoldScrollDistance) / totalScrollDistance;

            if (progress < landingThreshold) {
              newSection = '';
            } else if (progress < servicesThreshold) {
              newSection = 'services';
            } else if (progress < visionThreshold) {
              newSection = 'vision';
            } else {
              newSection = 'contact';
            }

            // Only update if section changed
            if (newSection !== currentSection) {
              currentSection = newSection;
              const newUrl = newSection ? `/#${newSection}` : '/';
              window.history.replaceState(null, '', newUrl);
            }
          },
        },
      });

      // Stage 1: Move through Landing + Services
      tl.to(sections, {
        x: -stage1End,
        ease: 'none',
      }, 0);

      // Stage 2: HOLD during Vision (no movement, just scroll time)
      const visionStartProgress = stage1End / totalScrollDistance;
      const visionEndProgress = (stage1End + visionHoldScrollDistance) / totalScrollDistance;

      tl.to(sections, {
        x: -stage2End, // Same position (HOLD)
        ease: 'none',
      }, visionEndProgress);

      // Stage 3: Move to Contact
      tl.to(sections, {
        x: -stage3End,
        ease: 'none',
      }, 1);

      // Update Vision section's data attributes with exact progress window
      const visionElement = sections.querySelector('[data-progress-start]') as HTMLElement;
      if (visionElement) {
        visionElement.dataset.progressStart = visionStartProgress.toString();
        visionElement.dataset.progressEnd = visionEndProgress.toString();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
            width: containerWidth,
            height: '100vh',
            willChange: 'transform',
          }}
        >
          <LandingSection />
          <ServicesSection />
          <VisionSection />
          <ContactSection />
        </div>
      </div>

    </>
  );
}
