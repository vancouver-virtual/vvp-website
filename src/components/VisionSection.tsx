'use client';

import { useEffect, useRef, useState } from 'react';
import tokens from '../../design/tokens.json';
import styles from './VisionSection.module.css';

const visionStatements = [
  "Virtual production, real results.",
  "Creativity first, technology second.",
  "Premium craft, proven delivery."
];

export default function VisionSection() {
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisionInView, setIsVisionInView] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const winTop = window.scrollY;
      const winHeight = window.innerHeight;
      const winMid = winHeight / 2 + winTop;
      const winBot = winHeight + winTop;

      const scrollWrap = scrollWrapRef.current;
      if (!scrollWrap) return;

      // Check if Vision section is in viewport
      const wrapRect = scrollWrap.getBoundingClientRect();
      const wrapTop = wrapRect.top + winTop;
      const wrapBot = wrapTop + wrapRect.height;
      const inView = wrapBot > winTop && wrapTop < winBot;
      setIsVisionInView(inView);

      const scrollTriggers = scrollWrap.querySelectorAll('.scroll-trigger');
      let activeIndex = 0;

      scrollTriggers.forEach((trigger, index) => {
        const rect = trigger.getBoundingClientRect();
        const liTop = rect.top + winTop;
        const liBot = liTop + rect.height;

        if (liTop <= winMid && liBot > winMid) {
          activeIndex = index + 1;
        }
      });

      setCurrentStep(activeIndex);

      // Track scroll direction
      if (winTop > lastScrollTop) {
        // Scrolling down
      } else {
        // Scrolling up
      }
      lastScrollTop = winTop;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <>
      {/* Fixed Vision Container - only visible when in view */}
      <div
        data-section="vision"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: tokens.colors.bg.base,
          zIndex: 1,
          opacity: isVisionInView ? 1 : 0,
          pointerEvents: isVisionInView ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Aurora background - static */}
        <div className={styles.container} />

        {/* Single "Our Vision" header */}
        <div style={{
          position: 'absolute',
          top: `${tokens.spacing['3xl']}px`,
          left: `${tokens.spacing['3xl']}px`,
          fontSize: tokens.typography.size.body,
          color: tokens.colors.on.bgSecondary,
          letterSpacing: tokens.typography.letterSpacing.wide,
          textTransform: 'uppercase',
          fontWeight: tokens.typography.weight.regular,
          zIndex: 10,
        }}>
          Our Vision
        </div>

        {/* Statement panels - stacked */}
        {visionStatements.map((statement, index) => {
          const step = index + 1;
          const isActive = currentStep === step;
          const isPast = currentStep > step;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1s ease',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '1000px',
                  padding: `${tokens.spacing['3xl']}px`,
                  fontSize: 'clamp(48px, 5vw, 64px)',
                  fontWeight: tokens.typography.weight.heavy,
                  color: tokens.colors.on.bg,
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  transform: isActive ? 'scale(1)' : isPast ? 'scale(0.5)' : 'scale(2)',
                  transition: 'transform 1s ease',
                }}
              >
                {statement}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll triggers - invisible divs that control the state */}
      <div
        ref={scrollWrapRef}
        style={{
          position: 'relative',
          zIndex: 0,
        }}
      >
        {visionStatements.map((_, index) => (
          <div
            key={index}
            className="scroll-trigger"
            style={{
              height: '100vh',
            }}
          />
        ))}
      </div>
    </>
  );
}
