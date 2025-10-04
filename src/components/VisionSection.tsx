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
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const statements = statementRefs.current.filter(Boolean);
    if (statements.length === 0) return;

    // Set initial state
    statements.forEach((statement) => {
      if (!statement) return;
      const spans = statement.querySelectorAll('span');
      gsap.set(spans, { opacity: 0, scale: 0.8, y: 30 });
    });

    const timer = setTimeout(() => {
      // Find parent horizontal scroll trigger
      const parentTriggers = ScrollTrigger.getAll();
      const parentScrollTrigger = parentTriggers.find(t => t.vars.pin === true);

      if (!parentScrollTrigger) return;

      let rafId: number;
      let isInView = false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInView = entry.isIntersecting;

            if (isInView) {
              const animate = () => {
                const parentProgress = parentScrollTrigger.progress;

                // Vision starts at ~0.75 and goes to 1.0 (3 sections)
                const visionStart = 0.75;
                const visionEnd = 1.0;
                const visionRange = visionEnd - visionStart;

                if (parentProgress >= visionStart && parentProgress <= visionEnd) {
                  const localProgress = (parentProgress - visionStart) / visionRange;

                  // Each statement gets 1/3 of the progress
                  statements.forEach((statement, index) => {
                    if (!statement) return;

                    const spans = statement.querySelectorAll('span');
                    const progressPerStatement = 1 / visionStatements.length;

                    const statementStart = index * progressPerStatement;
                    const fadeInEnd = statementStart + (progressPerStatement * 0.3);
                    const holdEnd = statementStart + (progressPerStatement * 0.7);
                    const statementEnd = (index + 1) * progressPerStatement;

                    if (localProgress < statementStart) {
                      gsap.set(spans, { opacity: 0, scale: 0.8, y: 30 });
                    } else if (localProgress >= statementStart && localProgress < fadeInEnd) {
                      const phaseProgress = (localProgress - statementStart) / (fadeInEnd - statementStart);
                      spans.forEach((span) => {
                        gsap.set(span, {
                          opacity: phaseProgress,
                          scale: 0.8 + (phaseProgress * 0.2),
                          y: 30 - (phaseProgress * 30)
                        });
                      });
                    } else if (localProgress >= fadeInEnd && localProgress < holdEnd) {
                      spans.forEach((span) => {
                        gsap.set(span, { opacity: 1, scale: 1, y: 0 });
                      });
                    } else if (localProgress >= holdEnd && localProgress < statementEnd) {
                      const phaseProgress = (localProgress - holdEnd) / (statementEnd - holdEnd);
                      spans.forEach((span) => {
                        gsap.set(span, {
                          opacity: 1 - phaseProgress,
                          scale: 1 + (phaseProgress * 0.1),
                          y: -(phaseProgress * 20)
                        });
                      });
                    } else {
                      gsap.set(spans, { opacity: 0, scale: 1.1, y: -20 });
                    }
                  });
                } else if (parentProgress < visionStart) {
                  statements.forEach((statement) => {
                    if (!statement) return;
                    const spans = statement.querySelectorAll('span');
                    gsap.set(spans, { opacity: 0, scale: 0.8, y: 30 });
                  });
                }

                if (isInView) {
                  rafId = requestAnimationFrame(animate);
                }
              };

              animate();
            } else {
              if (rafId) {
                cancelAnimationFrame(rafId);
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }, 400);

    return () => {
      clearTimeout(timer);
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
      style={{
        position: 'relative',
        minWidth: '300vw', // 3 sections worth of horizontal scroll space
        height: '100vh',
        flexShrink: 0,
        background: tokens.colors.bg.base,
      }}
    >
      {/* Single "Our Vision" header - fixed position */}
      <div style={{
        position: 'fixed',
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

      {/* Horizontal rail of panels with scroll snap */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          height: '100vh',
          width: '300vw',
          scrollSnapType: 'x mandatory',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {visionStatements.map((statement, index) => (
          <div
            key={index}
            style={{
              minWidth: '100vw',
              width: '100vw',
              height: '100vh',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
            }}
          >
            <div
              ref={el => statementRefs.current[index] = el}
              style={{
                width: '100%',
                maxWidth: '1000px',
                padding: `${tokens.spacing['3xl']}px`,
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
          </div>
        ))}
      </div>
    </div>
  );
}
