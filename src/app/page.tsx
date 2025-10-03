'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = sectionsRef.current;
    const container = containerRef.current;

    if (!sections || !container) return;

    // Get the total width we need to scroll
    const getScrollWidth = () => {
      return sections.scrollWidth - window.innerWidth;
    };

    // Create horizontal scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${getScrollWidth()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(sections, {
      x: () => -getScrollWidth(),
      ease: 'none',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Right Menu Bar - Fixed position outside the scrolling container */}
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
        </div>

        {/* Services Page */}
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
      </div>
    </div>

    {/* Spacer to create scroll space for ScrollTrigger */}
    <div style={{ height: `${1762}px` }} />
    </>
  );
}
