'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../../design/tokens.json';
import LandingSection from '@/components/LandingSection';
import ServicesSection from '@/components/ServicesSection';
import VisionSection from '@/components/VisionSection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState('200vw');
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = sectionsRef.current;
    const container = containerRef.current;

    if (!sections || !container) return;

    // Kill any existing ScrollTriggers to prevent conflicts when returning from other pages
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Reset transform on sections
    gsap.set(sections, { x: 0 });

    // Calculate scroll width to accommodate Landing + Services
    // Vision is outside horizontal scroll container

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

    // Container needs to hold all three sections side by side
    // Landing (100vw) + Services (servicesContentWidth) + Vision (100vw)
    const totalContainerWidth = landingSectionWidth + servicesContentWidth + visionSectionWidth;
    const widthInVw = (totalContainerWidth / window.innerWidth) * 100;
    setContainerWidth(`${widthInVw}vw`);

    let currentSection = '';

    // Calculate horizontal scroll distance (how far we need to translate to show Vision)
    // We need to move past Landing (100vw) and Services (servicesContentWidth) minus the viewport
    const horizontalScrollDistance = landingSectionWidth + servicesContentWidth;

    // Calculate snap points based on scroll distances
    const landingEnd = landingSectionWidth;
    const servicesEnd = landingSectionWidth + (servicesContentWidth - window.innerWidth);

    // Convert to progress values (0-1) for the horizontal scroll
    const snapPoints = [
      0,
      landingEnd / horizontalScrollDistance,
      servicesEnd / horizontalScrollDistance,
      1,
    ];

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Small delay to ensure DOM is ready and previous ScrollTriggers are fully cleaned up
    const timer = setTimeout(() => {
      // Create horizontal scroll animation
      // The horizontal scroll needs to move Landing + Services out, bringing Vision into view
      // PLUS extra scroll distance for Vision statement animations
      const visionAnimationScrollHeight = window.innerHeight * 2; // Extra scroll for 3 statements
      const totalScrollDistance = horizontalScrollDistance + visionAnimationScrollHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalScrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: prefersReducedMotion ? false : {
            snapTo: snapPoints,
            duration: { min: 0.2, max: 0.5 },
            ease: 'power1.inOut',
          },
          onUpdate: (self) => {
            // Update URL hash based on scroll progress
            const progress = self.progress;
            let newSection = '';

            // Use more precise progress values based on actual sections
            const landingThreshold = landingEnd / totalScrollDistance;
            const servicesThreshold = servicesEnd / totalScrollDistance;
            const visionThreshold = horizontalScrollDistance / totalScrollDistance;

            if (progress < landingThreshold) {
              newSection = '';
            } else if (progress < visionThreshold) {
              newSection = 'services';
            } else {
              newSection = 'vision';
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

      // Move sections horizontally until Vision is in view, then hold position
      tl.to(sections, {
        x: () => -horizontalScrollDistance,
        ease: 'none',
      }, 0)
      // Add a hold at the end (no movement during Vision animations)
      .to(sections, {
        x: () => -horizontalScrollDistance,
        ease: 'none',
      }, horizontalScrollDistance / totalScrollDistance);

      // Update Vision section's data attributes with exact progress window
      // Vision animations start AFTER horizontal scroll completes (at progress 1.0 of horizontal)
      const visionStartProgress = horizontalScrollDistance / totalScrollDistance;
      const visionEndProgress = 1.0;
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
                {['Services', 'Our Vision', 'Tour the Facility', 'Meet the Team'].map((item) => (
                  <button
                    key={item}
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
        </div>
      </div>

    </>
  );
}
