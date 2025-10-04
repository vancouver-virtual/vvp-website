'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../../design/tokens.json';

gsap.registerPlugin(ScrollTrigger);

const visionStatements = [
  "Virtual production, real results.",
  "Creativity first, technology second.",
  "Premium craft, proven delivery."
];

export default function VisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const statements = statementsRef.current.filter(Boolean);
    if (statements.length === 0) return;

    // Set initial state for all statements
    statements.forEach((statement) => {
      if (!statement) return;
      const spans = statement.querySelectorAll('span');
      gsap.set(statement, { opacity: 0 });
      gsap.set(spans, { opacity: 0, scale: 0.9, y: 20 });
    });

    // Use IntersectionObserver to detect when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            // Animate each statement in sequence
            statements.forEach((statement, index) => {
              if (!statement) return;

              const spans = statement.querySelectorAll('span');
              const startDelay = index * 2; // 2 seconds between each statement

              // Fade in
              gsap.to(statement, {
                opacity: 1,
                duration: 0.5,
                delay: startDelay,
                ease: 'power2.out'
              });

              gsap.to(spans, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                delay: startDelay,
                stagger: 0.1,
                ease: 'power2.out'
              });

              // Fade out (except for the last one)
              if (index < statements.length - 1) {
                gsap.to(statement, {
                  opacity: 0,
                  duration: 0.5,
                  delay: startDelay + 1.5,
                  ease: 'power2.in'
                });

                gsap.to(spans, {
                  opacity: 0,
                  scale: 1.05,
                  y: -15,
                  duration: 0.5,
                  delay: startDelay + 1.5,
                  stagger: 0.05,
                  ease: 'power2.in'
                });
              }
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      hasAnimated.current = false;
    };
  }, []);

  const splitTextIntoSpans = (text: string) => {
    const words = text.split(' ');
    return words.map((word, i) => (
      <span key={i} style={{ display: 'inline-block', marginRight: '0.3em' }}>
        {word}
      </span>
    ));
  };

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        minWidth: '100vw',
        height: '100vh',
        flexShrink: 0,
        scrollSnapAlign: 'start',
        background: tokens.colors.bg.base,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Pre-header */}
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

      {/* Vision Statements - Stacked and animated */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1000px',
        padding: `${tokens.spacing['3xl']}px`,
      }}>
        {visionStatements.map((statement, index) => (
          <div
            key={index}
            ref={el => statementsRef.current[index] = el}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              fontSize: '64px',
              fontWeight: tokens.typography.weight.heavy,
              color: tokens.colors.on.bg,
              lineHeight: '1.2',
              letterSpacing: '-0.5px',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {splitTextIntoSpans(statement)}
          </div>
        ))}
      </div>
    </div>
  );
}
